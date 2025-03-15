#!/bin/bash

set -euo pipefail

# Install deps
test -d www/js/vendor || mkdir www/js/vendor
cp node_modules/handlebars/dist/handlebars.min.js www/js/vendor

