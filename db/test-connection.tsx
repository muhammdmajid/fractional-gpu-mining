// db/test-connection.tsx
import "dotenv/config";
import { db } from "./index"; // ✅ adjust if your db is in another file
import { miningPlansTable } from "./schema";

async function main() {
  try {
    console.log("🔄 Testing database connection...");

    // Simple query to check connection
    const result = await db.select().from(miningPlansTable).limit(1);

    console.log("✅ Database connection successful!");
    console.log("First row:", result[0] || "No rows found in mining_plans");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  } finally {
    process.exit(0);
  }
}

main();


//  npx tsx db/test-connection.tsx