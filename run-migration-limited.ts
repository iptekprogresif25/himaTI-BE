import "dotenv/config";
import { sql } from "./src/config/db.js";
import fs from "fs";

async function run() {
  const query = fs.readFileSync("./src/migration_add_limited_assets.sql", "utf-8");
  try {
    await sql.unsafe(query);
    console.log("Migration for limited assets executed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

run();
