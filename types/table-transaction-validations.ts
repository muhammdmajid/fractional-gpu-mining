import { transactionSearchParamsCache } from "@/validation/table-transaction-validations";

// Type for usage in your API
export type GetTransactionsSchema = Awaited<
    ReturnType<typeof transactionSearchParamsCache.parse>
>;
