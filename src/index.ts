import { RollupPluginPrettier } from "./rollup-plugin-prettier"
import type { Plugin } from "rolldown"
import type { Options as PrettierOptions } from "prettier"

export interface Options extends PrettierOptions {
  /**
   * Directory to look for a Prettier config file.
   *
   * If omitted, defaults to `process.cwd()`.
   */
  cwd?: string

  /**
   * Whether to generate a sourcemap.
   *
   * Note: This may take some time because rollup-plugin-prettier diffs the
   * output to manually generate a sourcemap.
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
  const plugin = new RollupPluginPrettier(options)

  return {
    /**
     * Plugin name (used by rollup for error messages and warnings).
     * @type {string}
     */
    name: plugin.name,

    /**
     * Function called by `rollup` before generating final bundle.
     *
     * @param source Souce code of the final bundle.
     * @param _chunkInfo Chunk info.
     * @param outputOptions Output option.
     * @return The result containing a `code` property and, if a enabled, a `map` property.
     */
    renderChunk(source, _chunkInfo, outputOptions) {
      return plugin.reformat(source, {
        sourcemap: Boolean(outputOptions.sourcemap)
      })
    }
  }
}

export { rollupPluginPrettier as default }
