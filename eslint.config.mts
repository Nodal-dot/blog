import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import path from "path";

const compat = new FlatCompat({
    baseDirectory: path.resolve("."),
});

export default defineConfig([
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            js,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
        },
        languageOptions: { globals: globals.browser },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
        settings: {
            react: { version: "detect" },
        },
    },

    tseslint.configs.recommended,

    ...compat.config({
        extends: ["next/core-web-vitals"],
        rules: {
            "@next/next/no-img-element": "warn",
            "@next/next/no-html-link-for-pages": "error",
        },
    }),
]);
