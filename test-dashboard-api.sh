#!/bin/bash

# Login to get token
echo "Logging in as student..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@arq.com","password":"Student123@"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken // .accessToken // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✓ Got token: ${TOKEN:0:20}..."

# Test dashboard endpoint
echo ""
echo "Testing dashboard endpoint..."
curl -s -X GET http://localhost:3001/api/v1/progress/me/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq '.'
