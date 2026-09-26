import { cp, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const builtDir = join(root, 'js-built');
const jsDir = join(root, 'js');

await mkdir(jsDir, { recursive: true });

const files = await readdir(builtDir);
for (const file of files) {
    if (file.endsWith('.bundle.js')) {
        await cp(join(builtDir, file), join(jsDir, file));
    }
}

const chunksDir = join(builtDir, 'chunks');
try {
    await cp(chunksDir, join(jsDir, 'chunks'), { recursive: true });
} catch {
    // no shared chunks
}
