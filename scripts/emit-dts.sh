#!/bin/sh
set -eux
node_modules/.bin/tsc --project src --noEmit false --outDir dist --emitDeclarationOnly true --declaration true --noCheck
