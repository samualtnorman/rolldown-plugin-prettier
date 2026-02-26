# Samual's Rolldown Plugin Prettier
Rollup plugin that can be used to run [Prettier](https://prettier.io/) on the final bundle.

## Usage
Add the plugin `npm install --save-dev @samual/rolldown-plugin-prettier`, then add it to your `rolldown.config.js`, for
example:

```js
import prettier from "@samual/rolldown-plugin-prettier"
// …
export default {
	// …
	plugins: [
		// …
		prettier({
			printWidth: 120,
			tabWidth: 4,
			useTabs: true,
			semi: false,
			trailingComma: "none",
			arrowParens: "avoid",
			experimentalTernaries: true
		})
	]
}
```

## Plugin Options
### `cwd`
- default: `process.cwd()`
- type: `string`
- example: `prettier({ cwd: "path/to/dir" })`
- purpose: The directory prettier will use to find the local config

### `sourcemap`
- default: `null`
- type: `boolean | 'silent'`
- example: `prettier({ sourcemap: true })`
- purpose: Create a sourcemap if the global rollup options don't specify. Set to `"silent"` to avoid
`@samual/rolldown-plugin-prettier` warning.

If source map is enabled in the global rollup options, then a source map will be generated on the formatted bundle
(except if sourcemap are explicitely disabled in the prettier options).

Note that this may take some time since `prettier` package is not able to generate a sourcemap and this plugin must
compute the diff between the original bundle and the formatted result and generate the corresponding sourcemap: for
this reason, sourcemap are disabled by default. To enable them, simply pass `sourcemap: true`.

## Contributing
If you find a bug or think about enhancement, feel free to contribute and submit an issue or a pull request. See
`CONTRIBUTING.md`.

## Credit
Thank you [Mickael Jeanroy](https://github.com/mjeanroy) for making the version of this plugin that this was forked from
[`rollup-plugin-prettier`](https://github.com/mjeanroy/rollup-plugin-prettier).

Please see `LICENSE`.
