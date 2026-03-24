#!/usr/bin/env node
import { assert } from "@samual/assert"

const Base32 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef`
const version = process.argv[2]

if (!version) {
	process.stderr.write(`Expected 1 argument\n`)
	process.exit(1)
}

const match = version.match(/\.([A-Za-f]{9})\.([A-Za-f]{6})$/)

if (!match) {
	process.stderr.write(`Invalid version\n`)
	process.exit(1)
}

const [ , encodedTime, encodedHash ] = match

assert(encodedTime)
assert(encodedHash)

{
	const [ a, b, c, d, e, f, g, h, i ] = /** @type {[ number, number, number, number, number, number, number, number, number ]} */
		(encodedTime.split(``).map(char => Base32.indexOf(char)))

	const time = (a * (2 ** 40)) + (b * (2 ** 35)) + (c * (2 ** 30)) + (d << 25) +
		(e << 20) + (f << 15) + (g << 10) + (h << 5) + i

	console.log(`Date:`, new Date(time).toLocaleString())
}

{
	const buffer = Buffer.alloc(4)

	const [ a, b, c, d, e, f ] = /** @type {[ number, number, number, number, number, number ]} */
		(encodedHash.split(``).map(char => Base32.indexOf(char)))

	buffer[0] = (a << 3) | (b >> 2)
	buffer[1] = (b << 6) | (c << 1) | (d >> 4)
	buffer[2] = (d << 4) | (e >> 1)
	buffer[3] = (e << 7) | (f << 2)

	console.log(`Hash:`, buffer.toString(`hex`).slice(0, 7))
}

process.exit()
