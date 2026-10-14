import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");

let count = 0;
let files = 0;

const walk = (dir, cb) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, cb);
    else if (entry.name.endsWith(".ts")) cb(fullPath);
  }
};

const fixImports = (content) => {
  return content.replace(
    /(from\s+|import\s+)["'](\.[^"']+?)["']/g,
    (match, prefix, importPath) => {
      if (/\.(js|json|mjs|cjs)$/.test(importPath)) {
        return match;
      }
      if (importPath.endsWith("/")) {
        return match;
      }
      return `${prefix}"${importPath}.js"`;
    },
  );
};

walk(ROOT, (filePath) => {
  files++;
  const content = fs.readFileSync(filePath, "utf8");
  const fixed = fixImports(content);
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed);
    count++;
    console.log(`✓ Fixed: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`\n Scanned ${files} files, fixed ${count} files`);
console.log(`\n Done! Now run: npm run build`);
