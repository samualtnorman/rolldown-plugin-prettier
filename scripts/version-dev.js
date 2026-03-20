#!/usr/bin/env node
import { expect } from "@samual/assert"
import { spawnSync } from "child_process"
import * as Semver from "semver"
import packageConfig from "../package.json" with { type: "json" }

const time = Date.now()
const Base32 = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef`
const base32Char = (/** @type {number} */ value) => expect(Base32[value & 0x1F])

let timeEncoded = base32Char((time / (2 ** 40))) + base32Char((time / (2 ** 35))) + base32Char((time / (2 ** 30))) +
	base32Char(time >> 25) + base32Char(time >> 20) + base32Char(time >> 15) + base32Char(time >> 10) +
	base32Char(time >> 5) + base32Char(time)

const hash = parseInt(spawnSync("git", [ "rev-parse", "HEAD" ], { encoding: "utf8" }).stdout.trim().slice(0, 8), 16)

const hashEncoded = base32Char(hash >> 27) + base32Char(hash >> 22) + base32Char(hash >> 17) + base32Char(hash >> 12) +
	base32Char(hash >> 7) + base32Char(hash >> 2)

spawnSync(
	"npm",
	[ "version", `${expect(Semver.inc(packageConfig.version, "patch"))}-a.${timeEncoded}.${hashEncoded}` ],
	{ stdio: "inherit" }
)

process.exit()
