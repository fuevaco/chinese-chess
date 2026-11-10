// 在專用暫存目錄封裝，避免開發工具監看、鎖定中間產物；只交付完成的 EXE。
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const tempRoot = path.resolve(tmpdir());
const staging = await mkdtemp(path.join(tempRoot, 'chinese-chess-build-'));

try {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      path.join(root, 'node_modules/electron-builder/cli.js'),
      '--win', 'portable', '--x64', `--config.directories.output=${staging}`,
    ], { cwd: root, stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`封裝失敗：${code}`)));
  });

  const executables = (await readdir(staging)).filter(file => file.endsWith('.exe'));
  if (executables.length !== 1) throw new Error('找不到唯一的 Windows 免安裝 EXE');
  const output = path.join(root, 'release');
  await mkdir(output, { recursive: true });
  const artifact = path.join(output, executables[0]);
  await copyFile(path.join(staging, executables[0]), artifact);
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(artifact)) hash.update(chunk);
  console.log(`已完成：${artifact}`);
  console.log(`檔案大小：${(await stat(artifact)).size} bytes`);
  console.log(`SHA256：${hash.digest('hex')}`);
} finally {
  // 只清理本次 mkdtemp 建立、且仍位於指定暫存目錄內的資料夾。
  if (path.dirname(staging) !== tempRoot || !path.basename(staging).startsWith('chinese-chess-build-')) {
    throw new Error(`拒絕清理非預期的目錄：${staging}`);
  }
  await rm(staging, { recursive: true, force: true });
}
