import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import dotenv from "dotenv";
import {
  BACKUP_DIR,
  ENV_PATH,
  ensureDir,
  getLatestBackupFile,
  parseSourceDbFromAtlasUri,
} from "./backup-utils.js";

const CONTAINER_NAME = "mongodb-dev";
const TEMP_DB_NAME = "rim-ebay-temp";

function requireEnvFile(): void {
  if (!fs.existsSync(ENV_PATH)) {
    console.error(`Error: .env file not found at ${ENV_PATH}`);
    process.exit(1);
  }
}

function getSourceDbName(): string {
  requireEnvFile();
  dotenv.config({ path: ENV_PATH });
  const atlasUri = process.env.ATLAS_DATABASE_URL?.trim();
  if (!atlasUri) {
    console.warn(
      "Warning: ATLAS_DATABASE_URL not found in .env. assuming source DB is 'rim-ebay'.",
    );
    return "rim-ebay";
  }
  return parseSourceDbFromAtlasUri(atlasUri);
}

function runRestore(backupFile: string, sourceDbName: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      "-i",
      CONTAINER_NAME,
      "mongorestore",
      "--archive",
      "--gzip",
      `--nsFrom=${sourceDbName}.*`,
      `--nsTo=${TEMP_DB_NAME}.*`,
      "--drop",
    ];

    const child = spawn("docker", args, {
      stdio: ["pipe", "inherit", "inherit"],
    });

    const inputStream = fs.createReadStream(backupFile);
    inputStream.pipe(child.stdin);

    const onError = (error: Error) => {
      console.error(error.message);
      reject(error);
    };

    child.on("error", onError);
    inputStream.on("error", onError);

    child.on("close", (code) => {
      child.stdin.end();
      resolve(code ?? 1);
    });
  });
}

async function main(): Promise<void> {
  ensureDir(BACKUP_DIR);

  const latestBackup = getLatestBackupFile(BACKUP_DIR);
  if (!latestBackup) {
    console.log(`No backup files found in "${BACKUP_DIR}".`);
    process.exit(1);
  }

  const sourceDbName = getSourceDbName();
  const backupFile = path.resolve(latestBackup);

  console.log(`Found latest backup: ${path.basename(backupFile)}`);
  console.log(`Source DB detected: ${sourceDbName}`);
  console.log(`Restoring to temporary database '${TEMP_DB_NAME}'...`);

  const exitCode = await runRestore(backupFile, sourceDbName);

  if (exitCode === 0) {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log("Restore successful!");
    console.log("");
    console.log(
      `The backup data is now available in the database: '${TEMP_DB_NAME}'`,
    );
    console.log(
      "you can connect to it using your MongoDB client (e.g. Compass)",
    );
    console.log(
      `Connection String: mongodb://localhost:27017/${TEMP_DB_NAME}`,
    );
    console.log("----------------------------------------------------------------");
  } else {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log("Restore FAILED.");
    console.log("----------------------------------------------------------------");
    process.exitCode = exitCode;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
