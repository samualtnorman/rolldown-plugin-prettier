import * as diff from "diff"
import { isEmpty, omitBy } from "es-toolkit/compat"
import MagicString from "magic-string"
import path from "node:path"
import prettier from "prettier"
import type { SourceMapInput } from "rolldown"
import type { Options } from "."

export const NAME = `rolldown-plugin-prettier`

/**
 * The plugin options that are currently supported.
 */
const OPTIONS = new Set([
	'sourcemap',
	'cwd',
]);

/**
 * Resolve prettier config, using `resolveConfig` by default, switch to `resolveConfigSync` otherwise.
 * If none of these methods are available, returns `null` as a fallback.
 *
 * @param cwd The current working directory.
 * @returns A promise resolved with prettier configuration, or null.
 */
function resolvePrettierConfig(cwd: string): Promise<object | null> {
	// Since prettier 3.1.1, the resolver searches from a file path, not a directory.
	// Let's fake it by concatenating with a file name.
	const fromFile = path.join(cwd, '__noop__.js');

	if (prettier.resolveConfig) {
		return prettier.resolveConfig(fromFile);
	}

	return Promise.resolve(null);
}

/**
 * Reformat source code using prettier.
 *
 * @param options Initalization option.
 * @param source The source code to reformat.
 * @param outputOptions Output options.
 * @return The transformation result.
 */
export async function reformat(options: Options, source: string, outputOptions?: { sourcemap: boolean }): Promise<{ code: string, map?: SourceMapInput }> {
	let _options: Promise<Partial<Options> | undefined>

	// Initialize main options.
	_options = Promise.resolve(
		omitBy((options), (_value, key) => OPTIONS.has(key)),
	);

	// Try to resolve config file if it exists
	const cwd = "cwd" in options ? options.cwd : process.cwd();
	_options = Promise.all([resolvePrettierConfig(cwd), _options]).then((results) => (
		Object.assign({}, ...results.map((result) => result || {}))
	));

	// Reset empty options.
	_options = _options.then((opts) => (
		isEmpty(opts) ? undefined : opts
	));

	const sourcemap = outputOptions?.sourcemap
	const output = await prettier.format(source, await _options)

	// Should we generate sourcemap?
	// The sourcemap option may be a boolean or any truthy value (such as a `string`).
	// Note that this option should be false by default as it may take a (very) long time.
	const defaultSourcemap = options.sourcemap ?? false;
	const outputSourcemap = sourcemap == null ? defaultSourcemap : sourcemap;
	if (!outputSourcemap) {
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
