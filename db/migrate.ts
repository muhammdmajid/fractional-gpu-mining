import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from ".";


const runMigrations = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./db/migrations", // Correct the folder path
    });

    console.log("Migrations applied successfully.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Migration error:", error.message);
    } else {
      console.error("An unknown error occurred during migration.");
    }
    process.exit(1);
  }
};

// Run migrations
runMigrations();
