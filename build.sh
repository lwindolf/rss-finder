#!/bin/bash

set -euo pipefail

# Install deps
test -d www/js/vendor || mkdir www/js/vendor
cp node_modules/handlebars/dist/handlebars.min.js www/js/vendor
test -d www/js/parsers || mkdir www/js/parsers
cp -r lzone-feed-parser/src/* www/js/parsers

test -d www/data || mkdir -p www/data

# Install feed + blogroll index data
# Update it if necessary
for f in url-title.json blogroll.json; do
     if [ -f www/data/$f ] && [ $(find www/data/$f -mtime +7 | wc -l) -gt 0 ]; then
        echo "Dropping out-dated $f"
        rm www/data/$f
    fi
    if [ ! -f www/data/$f ]; then
        curl -L https://lwindolf.github.io/rss-feed-index/data/$f -o www/data/$f
    fi
done

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
