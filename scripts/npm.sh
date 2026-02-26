#!/bin/sh
set -eux
rm -rf dist
./rolldown.config.js
scripts/emit-package-json.js
cp LICENSE README.md src/index.d.ts dist
