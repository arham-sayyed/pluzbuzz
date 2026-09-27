import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Exported design-tool reference source, not application code.
    "docs/**",
  ]),
  {
    // Vendored animation components (installed via the shadcn registry, not
    // hand-written here) intentionally keep a ref in sync every render for
    // always-fresh reads inside rAF loops/event handlers — the stricter
    // React Compiler rules flag that pattern even though it's correct here.
    files: [
      "components/DriftWall.tsx",
      "components/PaperCrumple.tsx",
      "components/RefineFrame.tsx",
      "components/ScrollExpand.tsx",
      "components/SlideCommit.tsx",
      "components/TearTicket.tsx",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
