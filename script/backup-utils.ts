import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..");
export const BACKUP_DIR = path.join(PROJECT_ROOT, "backups");
export const ENV_PATH = path.join(PROJECT_ROOT, ".env");

export function ensureDir(targetDir: string): void {
  fs.mkdirSync(targetDir, { recursive: true });
}

export function formatTimestamp(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export function getLatestBackupFile(backupDir: string): string | null {
  if (!fs.existsSync(backupDir)) {
    return null;
  }

  const candidates = fs
    .readdirSync(backupDir)
    .filter((fileName) => fileName.toLowerCase().endsWith(".gz"))
    .map((fileName) => {
      const filePath = path.join(backupDir, fileName);
      const stats = fs.statSync(filePath);
      return { fileName, filePath, mtimeMs: stats.mtimeMs };
    });

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs);
  return candidates[0].filePath;
}

export function parseSourceDbFromAtlasUri(atlasUri: string): string {
  try {
    const url = new URL(atlasUri);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const dbName = pathParts[0] ?? "";
    return dbName ? decodeURIComponent(dbName) : "rim-ebay";
  } catch {
    return "rim-ebay";
  }
}
