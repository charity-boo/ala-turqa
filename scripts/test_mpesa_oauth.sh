#!/bin/bash
cd /home/chacha/projects/ala-turqa
echo "Fetching secrets..."
KEY=$(npx -y firebase-tools@latest functions:secrets:access MPESA_CONSUMER_KEY --project ala-turqa 2>/dev/null)
SECRET=$(npx -y firebase-tools@latest functions:secrets:access MPESA_CONSUMER_SECRET --project ala-turqa 2>/dev/null)
ENV=$(npx -y firebase-tools@latest functions:secrets:access MPESA_ENV --project ala-turqa 2>/dev/null)
SHORTCODE=$(npx -y firebase-tools@latest functions:secrets:access MPESA_SHORTCODE --project ala-turqa 2>/dev/null)
CB=$(npx -y firebase-tools@latest functions:secrets:access MPESA_CALLBACK_URL --project ala-turqa 2>/dev/null)

if [ "$ENV" = "production" ]; then
  BASE_URL="https://api.safaricom.co.ke"
else
  BASE_URL="https://sandbox.safaricom.co.ke"
fi

echo "Daraja Endpoint: $BASE_URL"
echo "Environment: $ENV"

AUTH=$(echo -n "${KEY}:${SECRET}" | base64 -w 0)

RES=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/oauth/v1/generate?grant_type=client_credentials" -H "Authorization: Basic $AUTH")

HTTP_CODE=$(echo "$RES" | tail -n1)
BODY=$(echo "$RES" | sed '$d')

echo "HTTP Status: $HTTP_CODE"

if echo "$BODY" | grep -q "access_token"; then
  echo "OAuth authentication: SUCCESS"
  echo "Access Token: Successfully Obtained"
  echo "Expiry Info: $(echo "$BODY" | grep -o '"expires_in":"[^"]*"' || echo "$BODY" | grep -o '"expires_in":[^,}]*')"
else
  echo "OAuth authentication: FAILED"
  echo "Response Body: $BODY"
fi

if [ -n "$SHORTCODE" ]; then 
  echo "Shortcode configured: YES"
else 
  echo "Shortcode configured: NO"
fi

if [ "$CB" = "https://us-central1-ala-turqa.cloudfunctions.net/api/payment/mpesa/callback" ]; then
  echo "Callback configured: YES"
else
  echo "Callback configured: NO ($CB)"
fi
