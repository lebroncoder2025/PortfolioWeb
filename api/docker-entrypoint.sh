#!/bin/bash
set -e

# Start php-fpm in background
php-fpm -D

# Start nginx in foreground
nginx -g "daemon off;"
