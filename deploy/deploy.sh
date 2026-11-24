#!/usr/bin/env bash
# (mẫu --exclude bắt đầu bằng / = chỉ ở gốc dự án; không có / sẽ loại cả src/**/data)
# Đẩy mã lên VPS và build lại container.  Dùng: deploy/deploy.sh [user@host]
# Không truyền tham số → lấy từ biến DEPLOY_HOST hoặc file deploy/.host (không đưa lên git).
# Trên VPS: mã ở /opt/nga-son-hoc-tap, cấu hình ở /opt/nga-son-hoc-tap/.env và bản sao lưu ở /opt/nga-son-hoc-tap/backups
# (cả hai KHÔNG bị ghi đè/xoá khi deploy),
# dữ liệu SQLite trong docker volume "nga-son-hoc-tap_sqlite-data".
set -euo pipefail
HOST=${1:-${DEPLOY_HOST:-$(cat "$(dirname "$0")/.host" 2>/dev/null || true)}}
: "${HOST:?Thiếu địa chỉ VPS: deploy/deploy.sh user@host, hoặc ghi vào deploy/.host}"
DIR=/opt/nga-son-hoc-tap
cd "$(dirname "$0")/.."
rsync -az --delete \
  --exclude /node_modules --exclude /.next --exclude /data --exclude /backups --exclude /.env --exclude '/.env.*.local' \
  --exclude '/docs/game-screens' --exclude '/docs/game-redesign-*' --exclude /tsconfig.tsbuildinfo \
  --exclude '/public/games/_backup' --exclude '/public/games/_preview' \
  ./ "$HOST:$DIR/"
ssh "$HOST" "cd $DIR && docker compose up -d --build && docker image prune -f >/dev/null && sleep 5 && curl -fsS -o /dev/null -w 'health %{http_code}\n' http://127.0.0.1:3210/api/health"
