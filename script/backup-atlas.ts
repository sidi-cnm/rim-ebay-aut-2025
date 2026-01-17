import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import dotenv from "dotenv";
import {
  BACKUP_DIR,
  ENV_PATH,
  ensureDir,
  formatTimestamp,
} from "./backup-utils.js";

const CONTAINER_NAME = "mongodb-dev";

function requireEnvFile(): void {
  if (!fs.existsSync(ENV_PATH)) {
    console.error(`Error: .env file not found at ${ENV_PATH}`);
    process.exit(1);
  }
}

function getAtlasUri(): string {
  requireEnvFile();
  dotenv.config({ path: ENV_PATH });
  const atlasUri = process.env.ATLAS_DATABASE_URL?.trim();
  if (!atlasUri) {
    console.error("Error: ATLAS_DATABASE_URL not found in .env file.");
    process.exit(1);
  }
  return atlasUri;
}

function runBackup(atlasUri: string, outputFile: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      "exec",
      CONTAINER_NAME,
      "mongodump",
      `--uri=${atlasUri}`,
      "--archive",
      "--gzip",
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

  const atlasUri = getAtlasUri();
  const timestamp = formatTimestamp();
  const outputFile = path.join(BACKUP_DIR, `backup-atlas-${timestamp}.gz`);

  console.log("");
  console.log("Starting backup from Atlas...");
  console.log("URI found.");
  console.log(`Container: ${CONTAINER_NAME}`);
  console.log(`Output: "${outputFile}"`);
  console.log("");

  const exitCode = await runBackup(atlasUri, outputFile);

  if (exitCode === 0) {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log("Atlas Backup successful!");
    console.log(`File: "${outputFile}"`);
    console.log("----------------------------------------------------------------");
  } else {
    console.log("");
    console.log("----------------------------------------------------------------");
    console.log("Backup FAILED.");
    console.log("- Check if your internet connection is active.");
    console.log(`- Check if the container '${CONTAINER_NAME}' is running.`);
    console.log("- Check if the DATABASE_URL in .env is correct.");
    console.log("----------------------------------------------------------------");
    process.exitCode = exitCode;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
