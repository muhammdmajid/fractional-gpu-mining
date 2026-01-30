// ==============================================
// 🌐 Transaction Search Params Cache Configuration
// ==============================================

import { TRANSACTION_STATUSES, TRANSACTION_TYPES, transactionTable } from "@/db/schema";
import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import {
    createSearchParamsCache,
    parseAsArrayOf,
    parseAsInteger,
    parseAsString,
    parseAsStringEnum,
} from "nuqs/server";

// ==============================================
// 🔍 Transaction Search Params Cache
// ==============================================
export const transactionSearchParamsCache = createSearchParamsCache({
    // 🔢 Pagination
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),

    // 🧭 Sorting Configuration (default: sort by date DESC)
    sort: getSortingStateParser<typeof transactionTable>().withDefault([
        { id: "date", desc: true },
    ]),

    // 🔎 Simple Filters
    title: parseAsString.withDefault(""),

    // ✅ Enum arrays — correctly wrapped with `parseAsStringEnum()`
    status: parseAsArrayOf(parseAsStringEnum([...TRANSACTION_STATUSES])).withDefault([]),
    type: parseAsArrayOf(parseAsStringEnum([...TRANSACTION_TYPES])).withDefault([]),

    // ✅ Wallet IDs (strings)
    walletId: parseAsArrayOf(parseAsString).withDefault([]),

    // ✅ Ranges (numbers)
    amountRange: parseAsArrayOf(parseAsInteger).withDefault([]), // [min, max]
    dateRange: parseAsArrayOf(parseAsInteger).withDefault([]),   // [startTimestamp, endTimestamp]

    // ⚙️ Advanced Filters
    filters: getFiltersStateParser().withDefault([]),
    joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});
