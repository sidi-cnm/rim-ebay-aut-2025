import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { BACKUP_DIR, ensureDir, formatTimestamp } from "./backup-utils.js";

const DB_NAME = "rim-ebay";
const CONTAINER_NAME = "mongodb-dev";

function runBackup(outputFile: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      CONTAINER_NAME,
      "mongodump",
      "--archive",
      "--gzip",
      "--db",
      DB_NAME,
    ];

    const child = spawn("docker", args, {
      stdio: ["ignore", "pipe", "inherit"],
    });

    const outputStream = fs.createWriteStream(outputFile);
    child.stdout.pipe(outputStream);

    const onError = (error: Error) => {
      console.error(error.message);
      reject(error);
    };

    child.on("error", onError);
    outputStream.on("error", onError);

    child.on("close", (code) => {
      outputStream.close();
      resolve(code ?? 1);
    });
  });
}

async function main(): Promise<void> {
  ensureDir(BACKUP_DIR);

  const timestamp = formatTimestamp();
  const outputFile = path.join(
    BACKUP_DIR,
    `backup-${DB_NAME}-${timestamp}.gz`,
  );

  console.log(
    `Starting backup for database '${DB_NAME}' from container '${CONTAINER_NAME}'...`,
  );

  const exitCode = await runBackup(outputFile);

  if (exitCode === 0) {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log("Backup successful!");
    console.log(`File: ${outputFile}`);
    console.log("----------------------------------------------------------------");
  } else {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log(
      `Backup FAILED. Please check if the container '${CONTAINER_NAME}' is running.`,
    );
    console.log("----------------------------------------------------------------");
    process.exitCode = exitCode;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
