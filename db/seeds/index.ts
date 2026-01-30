// ============================
// 🚀 Main Seed Runner

import { seedMiningPlans } from "./mining-plans";
import { seedAdminAccount } from "./seed-admin-account";

// ============================
export async function runSeed() {
  await seedMiningPlans();
  await seedAdminAccount();
  console.log("🎉 All seeds completed successfully.");
}

// Run directly if executed
if (require.main === module) {
  runSeed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
}