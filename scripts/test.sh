#!/bin/sh
set -eux
node_modules/.bin/knip
node_modules/.bin/tsc
scripts/npm.sh
