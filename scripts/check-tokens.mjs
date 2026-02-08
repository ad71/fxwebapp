import { execSync } from "node:child_process";

try {
  execSync("node scripts/generate-tokens.mjs", { stdio: "inherit" });
  execSync("node scripts/generate-color-list.mjs", { stdio: "inherit" });
  execSync("git diff --exit-code -- src/styles/tokens.css src/styles/tokens.ts src/preview/color-tokens.ts", {
    stdio: "inherit",
  });
} catch (err) {
  console.error("\nToken outputs are out of date. Re-run: npm run tokens:build");
  process.exit(1);
}
