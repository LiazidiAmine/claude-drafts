#!/bin/bash

echo "======================================================================"
echo "LOGGER OUTPUT DEMONSTRATION"
echo "======================================================================"
echo ""
echo "This demo shows how the logger handles objects in different modes"
echo ""

echo "======================================================================"
echo "1. DEVELOPMENT MODE (pretty-printed, colored)"
echo "======================================================================"
NODE_ENV=development NEXT_PUBLIC_APP_VERSION=1.0.0 node examples/object-logging-demo.js

echo ""
echo ""
echo "======================================================================"
echo "2. PRODUCTION MODE (JSON - PM2/Loki/Grafana ready)"
echo "======================================================================"
NODE_ENV=production NEXT_PUBLIC_APP_VERSION=1.0.0 node examples/object-logging-demo.js

echo ""
echo "======================================================================"
echo "DONE! Check the outputs above to see the difference."
echo "======================================================================"
