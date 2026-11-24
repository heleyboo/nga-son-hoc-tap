#!/usr/bin/env bash
# Chờ thcsngason.online trỏ về Cloudflare (sau khi đổi nameserver) rồi xin chứng chỉ Let's Encrypt
# và thay chứng chỉ tự ký trong nginx. Chạy nền trên VPS:
#   systemd-run --unit=thcsngason-cert /opt/nga-son-hoc-tap/deploy/wait-cert.sh
# Xem tiến trình: journalctl -u thcsngason-cert -f
set -uo pipefail
DOMAIN=thcsngason.online
CONF=/etc/nginx/sites-available/$DOMAIN
for i in $(seq 1 600); do   # tối đa ~50 giờ, 5 phút/lần
  # web phải đi qua Cloudflare tới đúng app (có header của Next.js)
  if curl -fsS -m 15 -o /dev/null -D - "http://$DOMAIN/api/health" 2>/dev/null | grep -qi '^server: cloudflare'; then
    echo "[$(date -Is)] $DOMAIN đã trỏ về Cloudflare → xin chứng chỉ"
    if certbot certonly --nginx --non-interactive --agree-tos --keep-until-expiring \
         --cert-name "$DOMAIN" -d "$DOMAIN" -d "www.$DOMAIN"; then
      sed -i "s#/etc/ssl/certs/ssl-cert-snakeoil.pem#/etc/letsencrypt/live/$DOMAIN/fullchain.pem#; s#/etc/ssl/private/ssl-cert-snakeoil.key#/etc/letsencrypt/live/$DOMAIN/privkey.pem#" "$CONF"
      nginx -t && systemctl reload nginx && echo "[$(date -Is)] Xong: nginx dùng chứng chỉ Let's Encrypt (tự gia hạn bởi certbot.timer)"
      exit 0
    fi
    echo "[$(date -Is)] certbot lỗi, thử lại sau 5 phút"
  else
    echo "[$(date -Is)] chưa trỏ về Cloudflare (lần $i), chờ 5 phút"
  fi
  sleep 300
done
echo "Hết thời gian chờ" >&2; exit 1
