import "dotenv/config";
import { sql } from "./src/config/db.js";
import fs from "fs";

async function run() {
  const query = fs.readFileSync("./src/migration_add_likes_assets.sql", "utf-8");
  try {
    await sql.unsafe(query);
    console.log("Migration executed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

run();
