import storybook from "eslint-plugin-storybook";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
    ...compat.extends("next/core-web-vitals"),
    ...storybook.configs["flat/recommended"],
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },
    {
        ignores: [".next/**", "node_modules/**", "**/.next/**", "out/**"],
    },
];

export default config;
