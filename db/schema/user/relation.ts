import { relations } from "drizzle-orm";
import { userTable } from ".";
import { transactionTable } from "../transaction";
import { referralTable } from "../referrals";


// 🔗 Define relations between users, transactions, and referrals
export const userTableRelations = relations(userTable, ({ many }) => ({
  // ➡️ All transactions where this user is the sender
  sentTransactions: many(transactionTable, {
    relationName: "sentTransactions", // must match transactionRelations.sender
  }),

  // ⬅️ All transactions where this user is the receiver
  receivedTransactions: many(transactionTable, {
    relationName: "receivedTransactions", // must match transactionRelations.receiver
  }),

    // ➡️ All referrals where this user is the referrer
  sentReferrals: many(referralTable, {
    relationName: "sentReferrals",
  }),

  // ⬅️ All referrals where this user is the referee
  receivedReferrals: many(referralTable, {
    relationName: "receivedReferrals",
  }),

}));

