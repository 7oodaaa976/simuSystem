const fs = require("fs");
const path = require("path");

const fontPath = path.resolve(__dirname, "../src/assets/fonts/Arial.ttf");
const outPath = path.resolve(__dirname, "../src/assets/fonts/Arial.base64.js");

const font = fs.readFileSync(fontPath);
const b64 = font.toString("base64");

fs.writeFileSync(outPath, `// auto-generated\nexport default "${b64}";\n`, "utf8");

console.log("✅ Generated:", outPath);
