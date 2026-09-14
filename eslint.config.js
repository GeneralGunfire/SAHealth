// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Minimal ESLint setup (Step 6): typescript-eslint's recommended rules
 * only, no stylistic/opinionated rules — this is a real lint pass for CI,
 * not a stand-in for tsc, but deliberately doesn't impose a house style on
 * top of what's already here.
 */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", "**/node_modules/**", "**/dist/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  }
);
