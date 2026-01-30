// 📦 Imports
import { PAYMENT_WITHDRAWAL_POLICY } from "@/config";
import { db } from "..";
import { userTable, userWalletAccountTable } from "../schema";
import { eq } from "drizzle-orm";
import { generateRandom10DigitNumber, generateUniqueId, } from "../utils";



// ============================
// 🌟 Seed Admin User + Wallet
// ============================
export async function seedAdminAccount() {
  const [existingAdmin] = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, PAYMENT_WITHDRAWAL_POLICY.ADMIN_USER_EMAIL));

  let adminId: string;
  if (existingAdmin) {
    adminId = existingAdmin.id;
    await db.update(userTable).set({
      name: PAYMENT_WITHDRAWAL_POLICY.ADMIN_USER_NAME,
      role: "admin",
      account_status: "active",
      updatedAt: new Date(),

    }).where(eq(userTable.id, adminId));
    console.log("♻️ Admin user updated:", adminId);
  } else {
    adminId = generateUniqueId("user", 36);
    await db.insert(userTable).values({
      id: adminId,
      name: PAYMENT_WITHDRAWAL_POLICY.ADMIN_USER_NAME,
      email: PAYMENT_WITHDRAWAL_POLICY.ADMIN_USER_EMAIL,
      emailVerified: true,
      role: "admin",
      referral_code:generateRandom10DigitNumber(),
      account_status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin user created:", adminId);
  }

  const [existingWallet] = await db
    .select()
    .from(userWalletAccountTable)
    .where(eq(userWalletAccountTable.userId, adminId));

  if (existingWallet) {
    await db.update(userWalletAccountTable).set({
      name: PAYMENT_WITHDRAWAL_POLICY.ADMIN_WALLET_NAME,
      currency: PAYMENT_WITHDRAWAL_POLICY.ADMIN_WALLET_CURRENCY,
      isAdmin: true,
      updatedAt: new Date(),
    }).where(eq(userWalletAccountTable.id, existingWallet.id));
    console.log("♻️ Admin wallet updated:", existingWallet.id);
  } else {
    const ADMIN_WALLET_ID = generateUniqueId("wallet", 38);
    await db.insert(userWalletAccountTable).values({
      id: ADMIN_WALLET_ID,
      userId: adminId,
      name: PAYMENT_WITHDRAWAL_POLICY.ADMIN_WALLET_NAME,
      balance: "0.0",
      isAdmin: true,
      currency: PAYMENT_WITHDRAWAL_POLICY.ADMIN_WALLET_CURRENCY,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Admin wallet created:", ADMIN_WALLET_ID);
  }
}

