const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk("app/(main)");
for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const newContent = content.replace(/(from\s+['"])((\.\.\/)+)(components|lib)/g, (match, p1, p2, p3, p4) => {
    return p1 + "../" + p2 + p4;
  });
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, "utf8");
    console.log("Fixed " + file);
  }
}
