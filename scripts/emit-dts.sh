#!/bin/sh
set -eux
node_modules/.bin/tsc -p src --noEmit false --outDir dist --emitDeclarationOnly true --declaration true --noCheck
