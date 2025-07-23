import { exec } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const run = (cmd) =>
  new Promise((resolve, reject) =>
    exec(cmd, (err, stdout, stderr) => {
      if (err) reject(stderr);
      else resolve(stdout)
    })
  );

const packagePath = path.resolve('package.json');
const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));

pkg.scripts = pkg.scripts || {};
pkg.scripts.lint = 'eslint . --ext .ts,.tsx,.js,.jsx';
pkg.scripts['lint:fix'] = 'eslint . --ext .ts,.tsx,.js,.jsx --fix';

writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
console.log('✅ تم تحديث package.json بإضافة السكربتات.');

console.log('\n🚀 جاري تشغيل "npm install eslint"...');
await run('npm install eslint');

console.log('🧹 جاري تشغيل "npm run lint:fix"...');
try {
  const result = await run('npm run lint:fix');
  console.log('\n✅ تم تصحيح الملفات:\n');
  console.log(result);
} catch (error) {
  console.error('\n❌ بعض الملفات ما تم تصحيحها تلقائيًا. الرجاء مراجعتها يدويًا:\n');
  console.error(error);
}
