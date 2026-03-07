#!node_modules/.bin/rolldown --config
import { rolldownConfig } from "@samual/rolldown-config"

export default rolldownConfig({
	rolldownOptions: {
		external: source => !(source == "es-toolkit" || source.startsWith("es-toolkit/") || source[0] == `/` || source[0] == ".")
	},
	experimental: { dts: true }
})
