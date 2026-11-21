import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appDir = path.join(root, 'store-services-next');
const outFile = path.join(appDir, 'out', 'services.html');
const dest = path.join(root, 'store-services.html');

if (!fs.existsSync(appDir)) {
  console.error('store-services-next غير موجود');
  process.exit(1);
}

const lock = path.join(appDir, 'package-lock.json');
const installArgs = fs.existsSync(lock) ? ['ci'] : ['install'];
const install = spawnSync('npm', installArgs, {
  cwd: appDir,
  stdio: 'inherit',
  shell: true,
});
if (install.status !== 0) process.exit(install.status ?? 1);

const build = spawnSync('npm', ['run', 'build'], {
  cwd: appDir,
  stdio: 'inherit',
  shell: true,
});
if (build.status !== 0) process.exit(build.status ?? 1);

if (!fs.existsSync(outFile)) {
  console.error('لم يُنشأ out/services.html — تحقق من مسار app/services/page.tsx');
  process.exit(1);
}

fs.copyFileSync(outFile, dest);

const nextStatic = path.join(appDir, 'out', '_next');
const nextDest = path.join(root, '_next');
if (fs.existsSync(nextStatic)) {
  fs.cpSync(nextStatic, nextDest, { recursive: true });
  console.log('تم نسخ _next/static إلى جذر الموقع');
}

console.log('تم نسخ store-services.html من Next.js static export');