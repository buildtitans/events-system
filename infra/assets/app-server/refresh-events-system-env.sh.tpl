#!/usr/bin/env bash
set -euo pipefail

DB_SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "{{ DB_SECRET_ARN }}" --query SecretString --output text)
COOKIE_SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "{{ COOKIE_SECRET_ARN }}" --query SecretString --output text)
APP_RUNTIME_JSON=$(aws secretsmanager get-secret-value --secret-id "{{ APP_RUNTIME_CONFIG_ARN }}" --query SecretString --output text)

PGPASSWORD=$(echo "$DB_SECRET_JSON" | jq -er .password)
COOKIES_SECRET=$(echo "$COOKIE_SECRET_JSON" | jq -er .secret)
RESEND_API_KEY=$(echo "$APP_RUNTIME_JSON" | jq -er .RESEND_API_KEY)
GEOAPIFY_API_KEY=$(echo "$APP_RUNTIME_JSON" | jq -er .GEOAPIFY_API_KEY)
GEOAPIFY_REQ_BASE_URL=$(echo "$APP_RUNTIME_JSON" | jq -er .GEOAPIFY_REQ_BASE_URL)
PROD_PW_RESET_URL=$(echo "$APP_RUNTIME_JSON" | jq -er .PROD_PW_RESET_URL)

TMP_FILE=$(mktemp)
cat > "$TMP_FILE" <<EOF
PGHOST={{ DB_HOST }}
PGPORT={{ DB_PORT }}
PGDATABASE={{ DB_NAME }}
PGUSER={{ DB_USER }}
GEOAPIFY_API_KEY=$GEOAPIFY_API_KEY
GEOAPIFY_REQ_BASE_URL=$GEOAPIFY_REQ_BASE_URL
PROD_PW_RESET_URL=$PROD_PW_RESET_URL
RESEND_API_KEY=$RESEND_API_KEY
PGMAX=10
PROD_FASTIFY_HOST=127.0.0.1
PROD_FASTIFY_PORT=3001
NODE_ENV=production
PGPASSWORD=$PGPASSWORD
COOKIES_SECRET=$COOKIES_SECRET
EOF

install -o root -g root -m 600 "$TMP_FILE" "{{ SERVER_ENV_FILE }}"
rm -f "$TMP_FILE"
