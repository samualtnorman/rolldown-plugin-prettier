#!node_modules/.bin/rolldown --config
import { rolldownConfig } from "@samual/rolldown-config"
import * as Path from "path"

export default rolldownConfig({
	rolldownOptions: {
		external: source => !(source == `es-toolkit` || source.startsWith(`es-toolkit/`) || Path.isAbsolute(source) || source.startsWith("."))
	}
})
