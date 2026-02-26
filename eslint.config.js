import eslint from "@eslint/js"
import * as depend from "eslint-plugin-depend"
import n from "eslint-plugin-n"
import { defineConfig, globalIgnores } from "eslint/config"
import tseslint from "typescript-eslint"
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat

export default defineConfig(
	globalIgnores([ `dist` ]),
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	tseslint.configs.disableTypeChecked,
	n.configs["flat/recommended"],
	depend.configs["flat/recommended"],
	compat.plugins("you-dont-need-lodash-underscore"),
	compat.extends("plugin:you-dont-need-lodash-underscore/compatible"),
	{
		languageOptions: { parserOptions: { projectService: true } },
		rules: {
			"n/no-unpublished-import": "off",
			"n/hashbang": "off",
			"n/no-process-exit": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-namespace": [ "error", { allowDeclarations: true } ]
		},
		settings: {
			n: { tryExtensions: [ `.ts` ] }
		}
	}
)
