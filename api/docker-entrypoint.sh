#!/bin/bash
set -euo pipefail

# Start php-fpm in background
echo "Starting php-fpm..."
php-fpm -D

# Wait for php-fpm to listen on 127.0.0.1:9000
echo "Waiting for php-fpm to accept connections on 127.0.0.1:9000..."
READY=0
for i in $(seq 1 30); do
	if (echo > /dev/tcp/127.0.0.1/9000) >/dev/null 2>&1; then
		READY=1
		echo "php-fpm is listening"
		break
	fi
	sleep 0.5
done

if [ "$READY" -ne 1 ]; then
	echo "ERROR: php-fpm did not start or is not listening on 127.0.0.1:9000"
	echo "--- php-fpm pool config (/usr/local/etc/php-fpm.d/www.conf) ---"
	if [ -f /usr/local/etc/php-fpm.d/www.conf ]; then
		sed -n '1,200p' /usr/local/etc/php-fpm.d/www.conf || true
	else
		echo "(no www.conf found)"
	fi
	echo "--- ps aux ---"
	ps aux || true
	echo "--- netstat/listening ports ---"
	if command -v ss >/dev/null 2>&1; then
		ss -lntp || true
	elif command -v netstat >/dev/null 2>&1; then
		netstat -lntp || true
	else
		echo "(no ss/netstat available)"
	fi
	exit 1
fi

echo "Starting nginx in background..."
# Remove any pre-existing default site that may define a default_server to avoid duplicate server errors
rm -f /etc/nginx/sites-enabled/default || true
rm -f /etc/nginx/sites-available/default || true
# We place our config under /etc/nginx/conf.d/portfolio.conf (copied at build time)
# Do not symlink into sites-enabled to avoid duplicate default_server definitions from base image files.

echo "--- nginx config test ---"
nginx -t 2>&1 | tee -a /var/log/nginx/error.log || true

echo "Starting nginx..."
nginx || { echo "nginx failed to start"; tail -n 200 /var/log/nginx/error.log || true; exit 1; }

echo "--- listening ports ---" >> /var/log/nginx/error.log 2>&1
if command -v ss >/dev/null 2>&1; then
	ss -lntp >> /var/log/nginx/error.log 2>&1 || true
elif command -v netstat >/dev/null 2>&1; then
	netstat -lntp >> /var/log/nginx/error.log 2>&1 || true
else
	echo "(no ss/netstat available)" >> /var/log/nginx/error.log 2>&1
fi

# Ensure log files exist, then tail them to keep container running and to surface errors in Railway logs
mkdir -p /var/log/nginx
touch /var/log/nginx/error.log /var/log/nginx/access.log /var/log/php-fpm.log || true
echo "Tailing nginx and php-fpm logs..."
exec tail -F /var/log/nginx/error.log /var/log/nginx/access.log /var/log/php-fpm.log
