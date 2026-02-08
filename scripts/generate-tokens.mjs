import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const tokensPath = path.join(root, "tokens", "tokens.json");
const outCss = path.join(root, "src", "styles", "tokens.css");
const outTs = path.join(root, "src", "styles", "tokens.ts");

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isNumericKey = (key) => /^\d+$/.test(key);
const isIdentifier = (key) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(key);

const flatten = (obj, prefix = []) => {
  const rows = [];
  for (const [key, value] of Object.entries(obj)) {
    const next = [...prefix, key];
    if (isPlainObject(value)) {
      rows.push(...flatten(value, next));
    } else {
      rows.push({ path: next, value });
    }
  }
  return rows;
};

const toCssVar = (pathParts) => `--${pathParts.join("-")}`;

const serializeTs = (value, indent = 0) => {
  const pad = " ".repeat(indent);
  if (!isPlainObject(value)) {
    return JSON.stringify(value);
  }

  const entries = Object.entries(value).map(([key, val]) => {
    let safeKey = key;
    if (isNumericKey(key)) {
      safeKey = key;
    } else if (!isIdentifier(key)) {
      safeKey = JSON.stringify(key);
    }
    return `${pad}  ${safeKey}: ${serializeTs(val, indent + 2)}`;
  });

  return `\n${pad}{\n${entries.join(",\n")}\n${pad}}`;
};

const cssLines = flatten(tokens).map(({ path, value }) =>
  `  ${toCssVar(path)}: ${value};`
);
const cssHeader = "/* Generated from tokens/tokens.json. Do not edit directly. */";
const tsHeader = "// Generated from tokens/tokens.json. Do not edit directly.";

const css = `${cssHeader}\n:root {\n${cssLines.join("\n")}\n}\n`;

const ts = `${tsHeader}\nexport const tokens = ${serializeTs(tokens)} as const;\n\nexport type Tokens = typeof tokens;\n`;

fs.mkdirSync(path.dirname(outCss), { recursive: true });
fs.writeFileSync(outCss, css);
fs.writeFileSync(outTs, ts);

console.log("Tokens generated:", outCss, outTs);
