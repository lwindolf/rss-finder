#!/bin/bash

set -euo pipefail

# Install deps
test -d www/js/vendor || mkdir www/js/vendor
cp node_modules/handlebars/dist/handlebars.min.js www/js/vendor

# Install feed index data
test -d www/data || mkdir -p www/data
curl -L https://lwindolf.github.io/rss-feed-index/data/url-title.json -o www/data/url-title.json
