import * as diff from "diff"
import MagicString from "magic-string"
import path from "node:path"
import prettier from "prettier"
import type { SourceMapInput } from "rolldown"
import type { Options } from "."

export const NAME = `rolldown-plugin-prettier`

/**
 * Reformat source code using prettier.
 *
 * @param options Initalization option.
 * @param source The source code to reformat.
 * @param outputOptions Output options.
 * @return The transformation result.
 */
export async function reformat(options: Options, source: string, outputOptions?: { sourcemap: boolean }): Promise<{ code: string, map?: SourceMapInput }> {
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
	const defaultSourcemap = options.sourcemap ?? false;
	if (!(outputOptions?.sourcemap ?? defaultSourcemap)) {
		return { code: output };
	}

	if (defaultSourcemap !== 'silent') {
		console.warn(`[${NAME}] Sourcemap is enabled, computing diff is required`);
		console.warn(`[${NAME}] This may take a moment (depends on the size of your bundle)`);
	}

	const magicString = new MagicString(source);
	const changes = diff.diffChars(source, output);

	if (changes && changes.length > 0) {
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
