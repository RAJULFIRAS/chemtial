import fs from "fs";
import path from "path";

const ROOT = path.resolve("src");

const walk = (dir, cb) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, cb);
    else if (entry.name.endsWith(".ts")) cb(fullPath);
  }
};

const fixImports = (content) => {
  return content.replace(/from\s+"(\.[^"]+)"/g, (match, importPath) => {
    if (/\.(js|json|mjs|cjs)$/.test(importPath)) return match;
    if (importPath.endsWith("/")) return match;
    return `from "${importPath}.js"`;
  });
};

let count = 0;
walk(ROOT, (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const fixed = fixImports(content);
  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed);
    count++;
    console.log(`Fixed: ${filePath}`);
  }
});

console.log(`\nTotal files fixed: ${count}`);
