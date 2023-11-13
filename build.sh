#!/bin/bash

cd "$(dirname "$0")"

cat > ./dist/download-shelf.js <<EOF
// Vivaldi Download Shelf Mod
//  -- version: $(cat ./VERSION)
//  --  author: 2called-chaos

// constants
DOWNLOAD_SHELF_TEMPLATE = \`$(cat ./src/shelf.html)\`;
DOWNLOAD_SHELF_STYLES = \`$(cat ./src/main.css)\`;
EOF

cat ./src/lib/*.js >> ./dist/download-shelf.js
cat ./src/main.js >> ./dist/download-shelf.js
