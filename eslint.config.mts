import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            "@next/next/no-img-element": "warn",
            "@next/next/no-html-link-for-pages": "error",
        },
    },
    prettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
