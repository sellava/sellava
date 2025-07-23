import fs from 'fs-extra';
import path from 'path';

// 1. حذف المتغيرات غير المستخدمة
function removeUnusedVariables(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      removeUnusedVariables(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // حذف المتغيرات المعرفة ولكن غير مستخدمة
      // NOTE: The 's' flag is not supported in ES2017 and below, so we avoid it.
      // This approach removes unused const/let variables declared at the start of a line,
      // followed by a semicolon and a newline, and not referenced elsewhere in the file.
      // It is a best-effort and may not cover all edge cases.
      content = content.replace(
        /^const\s+(\w+)\s*=\s*[^;]*;\s*\n(?:(?!\b\1\b)[\s\S])*$/gm,
        (match: string, varName: string) => {
          // If the variable name does not appear elsewhere, remove the declaration
          const regex = new RegExp(`\\b${varName}\\b`, 'g');
          // Remove the match itself from the content before searching
          const contentWithoutMatch = content.replace(match, '');
          if (!regex.test(contentWithoutMatch)) {
            return '';
          }
          return match;
        }
      );
      content = content.replace(
        /^let\s+(\w+)\s*=\s*[^;]*;\s*\n(?:(?!\b\1\b)[\s\S])*$/gm,
        (match: string, varName: string) => {
          const regex = new RegExp(`\\b${varName}\\b`, 'g');
          const contentWithoutMatch = content.replace(match, '');
          if (!regex.test(contentWithoutMatch)) {
            return '';
          }
          return match;
        }
      );

      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

// 2. إضافة export default إن كان مفقود
function ensureExportDefault(dir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      ensureExportDefault(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');

      // لو في دالة React رئيسية ولم يتم تصديرها
      if (/^function\s+\w+\s*\(/m.test(content) && !content.includes('export default')) {
        const match = content.match(/^function\s+(\w+)\s*\(/m);
        if (match) {
          const compName = match[1];
          content += `\n\nexport default ${compName};\n`;
          fs.writeFileSync(fullPath, content, 'utf-8');
        }
      }
    }
  }
}

// 3. إنشاء tsconfig.json لو مش موجود
function ensureTSConfig() {
  const tsPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsPath)) {
    fs.writeFileSync(
      tsPath,
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ESNext',
            module: 'ESNext',
            strict: true,
            jsx: 'preserve',
            esModuleInterop: true,
            moduleResolution: 'node',
            forceConsistentCasingInFileNames: true,
            skipLibCheck: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
          },
          include: ['src'],
        },
        null,
        2
      )
    );
    console.log('✅ تم إنشاء tsconfig.json');
  }
}

// 4. تشغيل ESLint تلقائي
function runESLintFix() {
  const { execSync } = require('child_process');
  try {
    execSync('npx eslint . --fix', { stdio: 'inherit' });
  } catch (err) {
    console.error('⚠️ فشل تشغيل ESLint');
  }
}

// تنفيذ جميع الخطوات
function main() {
  const srcDir = path.join(process.cwd(), 'src');
  console.log('🛠️ بدء إصلاح المشروع...');
  ensureTSConfig();
  removeUnusedVariables(srcDir);
  ensureExportDefault(srcDir);
  runESLintFix();
  console.log('✅ تم إصلاح المشروع. جرب تعيد تشغيل النشر.');
}

main();
