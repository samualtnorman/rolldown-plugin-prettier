import { diffChars } from "diff"
import MagicString from "magic-string"
import path from "node:path"
import type { Options as PrettierOptions } from "prettier"
import * as prettier from "prettier"
import type { Plugin } from "rolldown"

const NAME = `rolldown-plugin-prettier`

export interface Options extends PrettierOptions {
	/**
	 * Directory to look for a Prettier config file.
	 *
	 * @default process.cwd()
	 */
	cwd?: string

	/**
	 * Silence sourcemap warnings.
	 *
	 * Doesn't do anything if set to a boolean as Rolldown's own `output.sourcemap` decides if a sourcemap is generated.
	 * This behaviour matches [`rollup-plugin-prettier`](https://github.com/mjeanroy/rollup-plugin-prettier).
	 */
	sourcemap?: boolean | "silent"
}

declare namespace rollupPluginPrettier {
	export { Options }
}

/**
 * Create rollup plugin compatible with rollup >= 1.0.0
 *
 * @param options Plugin options.
 * @return Plugin instance.
 */
function rollupPluginPrettier(options: Options): Plugin {
	return {
		/**
		 * Plugin name (used by rollup for error messages and warnings).
		 * @type {string}
		 */
		name: NAME,

		/**
		 * Function called by `rollup` before generating final bundle.
		 *
		 * @param source Souce code of the final bundle.
		 * @param _chunkInfo Chunk info.
		 * @param outputOptions Output option.
		 * @return The result containing a `code` property and, if a enabled, a `map` property.
		 */
		async renderChunk(source, _chunkInfo, outputOptions) {
			// Since prettier 3.1.1, the resolver searches from a file path, not a directory.
			// Let's fake it by concatenating with a file name.
			const prettierConfig = await prettier.resolveConfig(path.join(options.cwd ?? process.cwd()))
			const { sourcemap, cwd, ...prettierOptions } = options
			const mergedOptions = { ...prettierConfig, ...prettierOptions }
	
			const output = await prettier.format(
				source,
				Reflect.ownKeys(mergedOptions).length ? mergedOptions : undefined
			)

			// Should we generate sourcemap?
			// The sourcemap option may be a boolean or any truthy value (such as a `string`).
			// Note that this option should be false by default as it may take a (very) long time.
			if (!outputOptions.sourcemap) {
				return { code: output };
			}

			if (options.sourcemap != 'silent') {
				console.warn(`[${NAME}] Sourcemap is enabled, computing diff is required`);
				console.warn(`[${NAME}] This may take a moment (depends on the size of your bundle)`);
			}

			const magicString = new MagicString(source);
			const changes = diffChars(source, output);

			if (changes.length) {
				let idx = 0;

				changes.forEach((part) => {
					if (part.added) {
						magicString.prependLeft(idx, part.value);
						idx -= part.count;
					} else if (part.removed) {
						magicString.remove(idx, idx + part.count);
					}

					idx += part.count;
				});
			}

			return {
				code: magicString.toString(),
				map: magicString.generateMap({
					hires: true,
				}),
			};
		}
	}
}

export { rollupPluginPrettier as default }
