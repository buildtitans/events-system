import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/server/core/db/migrations/**/*.ts"],

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  globalIgnores([
    ".deploy",
    ".next/**",
    ".deploy/**",
    "infra/**",
    "out/**",
    "build/**",
    "coverage/**",
    "src/server/dist/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
