#!/usr/bin/env bash
set -eu
cd /workspace/pan-homz
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node 22 or newer is required")'
npm ci --no-audit --no-fund --cache /workspace/.npm-cache
npm run fetch:images
npm run build
npm test
