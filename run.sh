#!/bin/bash -x

[ ! -d '/tmp/cache' ] && mkdir -p /tmp/cache

NODE_ENV=production exec node server.js
