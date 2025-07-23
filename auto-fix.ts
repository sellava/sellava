import { Project } from "ts-morph";
import path from "path";
import fs from "fs-extra";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

function walk(dir: string, callback: (filePath: string) => void) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      callback(fullPath);
    }
  }
}

function fixImages(code: string): string {
  return code
    .replace(/<img([^>]*?)\/?>/g, (match: string, attrs: string) => {
      const hasAlt = /alt=/.test(attrs);
      const fixedAttrs = hasAlt ? attrs : `${attrs} alt=""`;
      return `<Image${fixedAttrs} />`;
    })
    .replace(/import\s+Image\s+from\s+['"]next\/image['"];/, "") // remove duplicates
    .replace(/^/, `import Image from 'next/image';\n`);
}

function fixQuotes(code: string): string {
  return code
    .replace(/'([^']*?)'/g, (m) =>
      m.replace(/'/g, "&rsquo;")
    )
    .replace(/"([^"]*?)"/g, (m) =>
      m.replace(/"/g, "&quot;")
    );
}

function fixAny(code: string): string {
  return code.replace(/: any/g, ": unknown /* TODO: replace unknown */");
}

function processFile(filePath: string) {
  let code = fs.readFileSync(filePath, "utf8");
  const orig = code;

  code = fixImages(code);
  code = fixQuotes(code);
  code = fixAny(code);

  if (code !== orig) {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`✔️ Fixed ${filePath}`);
  }
}

// Main execution
const srcDir = path.join(process.cwd(), "src");
walk(srcDir, processFile);

console.log("✅ انتهى الفحص والتعديلات الأولية. شغل ESLint الآن لإكمال التنظيف:");
console.log("\nnpx eslint . --fix\n");
