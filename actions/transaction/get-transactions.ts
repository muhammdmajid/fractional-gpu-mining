"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { asc, count, desc, sql, eq, } from "drizzle-orm";

import {
  miningPlanOptionsTable,
  miningPlansTable,
  transactionTable,
  userTable,
  userWalletAccountTable,
} from "@/db/schema";
import { TransactionType, type Transaction } from "@/types/transaction";
import { type GetTransactionsSchema } from "@/types/table-transaction-validations";
import { filterColumns } from "@/lib/filter-columns";
import { PgColumn } from "drizzle-orm/pg-core";
import { ExtendedColumnFilter } from "@/types/data-table";


// ===============================
// ✅ Get Paginated Transactions (cached & filterable)
// ===============================
export async function getTransactions(input: GetTransactionsSchema, type?: TransactionType) {
  const { page, perPage, sort, filters, joinOperator = "and" } = input;

  return unstable_cache(
    async () => {
      try {
        const offset = (page - 1) * perPage;

        // Build where clause using filterColumns utility

        // --------------------------
        // Merge type filter if provided
        // --------------------------
        const extendedFilters: ExtendedColumnFilter<typeof transactionTable>[] = [
          ...(filters ?? []),
          ...(type
            ? [
              {
                id: "type",
                value: type,
                operator: "eq",
                variant: "text",
              } as ExtendedColumnFilter<typeof transactionTable>,
            ]
            : []),
        ];

        // Build where clause using filterColumns utility
        const where = filterColumns({
          table: transactionTable,
          filters: extendedFilters,
          joinOperator,
        });


        // --------------------------
        // Safe, type-checked orderBy
        // --------------------------
        const orderBy = sort?.length
          ? sort
            .map((s) => transactionTable[s.id as keyof Transaction])
            .filter(
              (column): column is
                | typeof transactionTable.createdAt
                | typeof transactionTable.id => !!column
            )
            .map((column, idx) => (sort[idx].desc ? desc(column) : asc(column)))
          : [desc(transactionTable.createdAt || transactionTable.id)];

        // --------------------------
        // Run transaction
        // --------------------------
        const { data, total } = await db.transaction(async (tx) => {
          const dataRaw = await tx
            .select({
              transactionId: transactionTable.id,
              title: transactionTable.title,
              description: transactionTable.description,
              date: transactionTable.date,
              type: transactionTable.type,
              status: transactionTable.status,
              amount: transactionTable.amount,
              currency: transactionTable.currency,
              thirdpartyTransactionId: transactionTable.thirdpartyTransactionId,
              thirdpartyWithdrawalAddress: transactionTable.thirdpartyWithdrawalAddress,

              // Wallet info
              walletId: userWalletAccountTable.id,
              walletName: userWalletAccountTable.name,
              walletBalance: userWalletAccountTable.balance,
              walletCurrency: userWalletAccountTable.currency,
                walletIsAdmin: userWalletAccountTable.isAdmin,
              walletAvailableAt: userWalletAccountTable.availableAt,
              

              // User info
              userId: userTable.id,
              userName: userTable.name,
              userEmail: userTable.email,
              userFirstName: userTable.firstName,
              userLastName: userTable.lastName,
              userRole: userTable.role,

              // Mining Plan info
              miningPlanId: miningPlansTable.id,
              miningPlanTitle: miningPlansTable.title,
              miningPlanDescription: miningPlansTable.description,

              // Billing Option info
              billingOptionId: miningPlanOptionsTable.id,
              billingOptionType: miningPlanOptionsTable.type,
              billingOptionCycle: miningPlanOptionsTable.miningCycle,
            })
            .from(transactionTable)
            .leftJoin(
              userWalletAccountTable,
              eq(userWalletAccountTable.id, transactionTable.walletId)
            )
            .leftJoin(userTable, eq(userTable.id, userWalletAccountTable.userId))
            .leftJoin(
              miningPlansTable,
              eq(miningPlansTable.id, transactionTable.miningPlanId)
            )
            .leftJoin(
              miningPlanOptionsTable,
              eq(miningPlanOptionsTable.id, transactionTable.billingOptionId)
            )
            .where(where)
            .orderBy(...orderBy)
            .limit(perPage)
            .offset(offset);

          const total = await tx
            .select({ count: count() })
            .from(transactionTable)
            .where(where)
            .then((res) => res[0]?.count ?? 0);

          return { data: dataRaw, total };
        });


        return { data, pageCount: Math.ceil(total / perPage) };
      } catch (err) {
        console.error("getTransactions error:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify({ input, type })],
    { revalidate: 60, tags: [`transactions-cache-${type}`] }
  )();
}
// ===============================
// ✅ Generic Enum Count Function (Fully Generic)
// ===============================
async function getEnumCounts<
  TField extends keyof typeof transactionTable,
  TValue extends string,
>(
  field: TField,
  validValues: readonly TValue[],
  defaultCounts: Record<TValue, number>
) {
  try {
    const column = transactionTable[field];

    // Ensure the column is a PgColumn (not undefined or a function)
    if (!column || typeof column !== "object" || !("dataType" in column)) {
      throw new Error(`Column "${String(field)}" is not a valid PgColumn`);
    }

    const result = await db
      .select({
        value: column as unknown as PgColumn, // safe cast to PgColumn
        count: count(),
      })
      .from(transactionTable)
      .groupBy(column as unknown as PgColumn);

    return result.reduce(
      (acc, { value, count }) => {
        if (validValues.includes(value as TValue)) {
          acc[value as TValue] = Number(count);
        }
        return acc;
      },
      { ...defaultCounts }
    );
  } catch (error) {
    console.error(
      `❌ Error in getEnumCounts for field ${String(field)}:`,
      error
    );
    return { ...defaultCounts };
  }
}

// ===============================
// ✅ Transaction Status Counts
// ===============================
export const getTransactionStatusCounts = unstable_cache(
  async () =>
    await getEnumCounts(
      "status",
      ["pending", "completed", "failed", "cancelled"] as const,
      {
        pending: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
      }
    ),
  ["transaction-status-counts"],
  { revalidate: 3600 }
);

// ===============================
// ✅ Transaction Type Counts
// ===============================
export const getTransactionTypeCounts = unstable_cache(
  async () =>
    await getEnumCounts("type", ["deposit", "withdrawal"] as const, {
      deposit: 0,
      withdrawal: 0,
    }),
  ["transaction-type-counts"],
  { revalidate: 3600 }
);

// ===============================
// ✅ Transaction Amount Range
// ===============================
export const getTransactionAmountRange = unstable_cache(
  async () => {
    try {
      const res = await db
        .select({
          min: sql<number>`min(${transactionTable.amount})`,
          max: sql<number>`max(${transactionTable.amount})`,
        })
        .from(transactionTable);

      return res[0] ?? { min: 0, max: 0 };
    } catch (error) {
      console.error("❌ Error fetching transaction amount range:", error);
      return { min: 0, max: 0 };
    }
  },
  ["transaction-amount-range"],
  { revalidate: 3600 }
);
