#!/bin/sh
set -eu

envsubst '$PORT $VITE_API_BASE_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'