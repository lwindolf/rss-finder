#!/bin/bash

set -euo pipefail

# Install deps
test -d www/js/vendor || mkdir www/js/vendor
cp node_modules/handlebars/dist/handlebars.min.js www/js/vendor

# Install feed index data
# Update it if necessary
test -d www/data || mkdir -p www/data
if [ -f www/data/url-title.json ] && [ $(find www/data/url-title.json -mtime +7 | wc -l) -gt 0 ]; then
    echo "Dropping out-dated url-title.json"
    rm www/data/url-title.json
fi
if [ ! -f www/data/url-title.json ]; then
    curl -L https://lwindolf.github.io/rss-feed-index/data/url-title.json -o www/data/url-title.json
fi

# Install fediverse server index
# Update it if necessary
if [ -f www/data/fediverse.json ] && [ $(find www/data/fediverse.json -mtime +7 | wc -l) -gt 0 ]; then
    echo "Dropping out-dated fediverse.json"
    rm www/data/fediverse.json
fi
if [ ! -f www/data/fediverse.json ]; then
    curl 'https://api.fediverse.observer/' \
        --compressed \
        -X POST \
        -H 'Accept: application/json, multipart/mixed' \
        -H 'Accept-Encoding: gzip, deflate, br, zstd' \
        --data-raw '{"query":"query MyQuery {\n  nodes {\n    name\n    softwarename\n    status\n    domain\n  }\n}","operationName":"MyQuery"}' \
        -o www/data/fediverse.json
fi

# Build subscriber index
npm run build.js
