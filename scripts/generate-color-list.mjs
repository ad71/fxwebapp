import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd());
const tokensPath = path.join(root, "tokens", "tokens.json");
const outPath = path.join(root, "src", "preview", "color-tokens.ts");

const tokens = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const colors = tokens.color || {};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

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

const makeGroup = (title, obj, basePath = []) => {
  const items = flatten(obj).map(({ path, value }) => {
    const fullPath = [...basePath, ...path];
    const name = fullPath.join("-");
    const cssVar = `--color-${fullPath.join("-")}`;
    return { name, cssVar, value };
  });
  return { title, items };
};

const groups = [
  makeGroup("Neutrals", colors.ink || {}, ["ink"]),
  makeGroup("Canvas & Surfaces", {
    canvas: colors.canvas,
    surface: colors.surface,
    border: colors.border,
  }),
  makeGroup("Brand", colors.brand || {}, ["brand"]),
  makeGroup("Semantic", colors.semantic || {}, ["semantic"]),
  makeGroup("Data Viz", colors.viz || {}, ["viz"]),
  makeGroup("Chart Defaults", colors.chart || {}, ["chart"]),
].filter((group) => group.items.length > 0);

const header = "// Generated from tokens/tokens.json. Do not edit directly.";
const output = `${header}\nexport const colorGroups = ${JSON.stringify(groups, null, 2)} as const;\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);

console.log("Color tokens generated:", outPath);
