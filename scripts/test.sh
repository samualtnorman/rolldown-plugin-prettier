#!/bin/sh
set -eux
node_modules/.bin/knip
node_modules/.bin/tsc
node_modules/.bin/tsc -p src
scripts/npm.sh
