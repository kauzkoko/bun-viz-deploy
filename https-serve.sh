#!/bin/bash
export NITRO_SSL_CERT="`cat ./localhost.pem`"
export NITRO_SSL_KEY="`cat localhost-key.pem`"
exec node .output/server/index.mjs