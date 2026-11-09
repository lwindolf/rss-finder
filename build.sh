#!/bin/bash

set -euo pipefail

# Install deps
test -d www/js/vendor || mkdir www/js/vendor
cp node_modules/handlebars/dist/handlebars.min.js www/js/vendor
cp node_modules/dompurify/dist/purify.min.js www/js/vendor
test -d www/js/parsers || mkdir www/js/parsers
cp -r lzone-feed-parser/src/* www/js/parsers

test -d www/data || mkdir -p www/data

# Install feed + blogroll index data
# Update it if necessary
for f in url-feeds.json meta.json blogroll.json; do
     if [ -f www/data/$f ] && [ $(find www/data/$f -mtime +7 | wc -l) -gt 0 ]; then
        echo "Dropping out-dated $f"
        rm www/data/$f
    fi
    if [ ! -f www/data/$f ]; then
        curl -L https://lzone.de/rss-feed-index/data/$f -o www/data/$f
    fi
done

# Drop outdated fediverse serve lists
find www/data/ -name "fediverse-*.json" -mtime +7 -delete

for s in funkwhale; do
    [ -f "www/data/fediverse-${s}.json" ] && continue

    echo "Updating www/data/fediverse-${s}.json ..."

    # Use https://fedidb.com/resources/api-docs#endpoint-v1-servers
    # Follow the cursor ("links.next") until exhausted and join all pages
    tmp=$(mktemp -d)
    url="https://api.fedidb.org/v1/servers?software=${s}&limit=40"
    page=0
    while [ -n "$url" ] && [ "$url" != "null" ]; do
        echo "  Fetching $url ..."
        curl -sfL "$url" -o "$tmp/page-$page.json"
        url=$(jq -r '.links.next // empty' "$tmp/page-$page.json")
        page=$((page + 1))
        sleep 1    # be polite to the API
    done
    jq -s '{data: map(.data) | add}' "$tmp"/page-*.json > "www/data/fediverse-${s}.json"
    rm -rf "$tmp"
done

# Build subscriber index
npm run build.js
