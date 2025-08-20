import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            js,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
        },

        extends: ["js/recommended", pluginReact.configs.flat.recommended],

        languageOptions: { globals: globals.browser },

        rules: {
            "react/react-in-jsx-scope": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },

        settings: {
            react: {
                version: "detect",
            },
        },
    },
    tseslint.configs.recommended,
]);
