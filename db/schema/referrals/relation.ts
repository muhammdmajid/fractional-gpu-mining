import { relations } from "drizzle-orm";
import { referralTable } from "./";
import { userTable } from "../user";

// 🔗 Define relations between users and referrals
// 🔗 Define relations between referrals and users
export const referralTableRelations = relations(referralTable, ({ one }) => ({
  // Referrer user details
  referrer: one(userTable, {
    fields: [referralTable.referrerId],
    references: [userTable.id],
    relationName: "sentReferrals", // 👈 this must match
  }),

  // Referee (invited) user details
  referee: one(userTable, {
    fields: [referralTable.refereeId],
    references: [userTable.id],
    relationName: "receivedReferrals", // 👈 must match
  }),
}));