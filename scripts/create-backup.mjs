import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const backupsDir = "C:\\backups-portal-necocli";

if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFolderName = `portal-necocli-backup-${timestamp}`;
const destDir = path.join(backupsDir, backupFolderName);

const excludeDirs = ["node_modules", ".next", ".git", "backups"];

console.log(`🚀 Iniciando backup en: ${destDir}...`);

try {
  fs.cpSync(rootDir, destDir, {
    recursive: true,
    filter: (src) => {
      const relativePath = path.relative(rootDir, src);
      // Ignorar carpetas pesadas o irrelevantes
      return !excludeDirs.some(
        (dir) =>
          relativePath === dir ||
          relativePath.startsWith(`${dir}\\`) ||
          relativePath.startsWith(`${dir}/`),
      );
    },
  });
  console.log(`✅ Backup creado exitosamente en la carpeta 'backups/${backupFolderName}'`);
} catch (error) {
  console.error("❌ Error creando backup:", error);
}
