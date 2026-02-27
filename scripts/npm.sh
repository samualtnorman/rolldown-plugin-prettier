#!/bin/sh
set -eux
rm -rf dist
./rolldown.config.js
scripts/emit-dts.sh
scripts/emit-package-json.js
cp LICENSE README.md dist
