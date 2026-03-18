#!/bin/bash

# Test verification endpoints locally
BASE_URL="http://localhost:5001/api"
WALLET="SPW435DHYWC9VCCP13BQ4EJRCVDYRA5FDNFV1GXT"

echo "Testing verification endpoints..."
echo ""

echo "1. GET /verification/:wallet"
curl -s "${BASE_URL}/verification/${WALLET}" | jq .
echo ""

echo "2. POST /verification/link"
curl -s -X POST "${BASE_URL}/verification/link" \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"${WALLET}\",\"provider\":\"github\",\"handle\":\"testuser\"}" | jq .
echo ""

echo "3. GET /verification/:wallet (after link)"
curl -s "${BASE_URL}/verification/${WALLET}" | jq .
echo ""

echo "4. DELETE /verification/unlink"
curl -s -X DELETE "${BASE_URL}/verification/unlink" \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"${WALLET}\",\"provider\":\"github\"}" | jq .
echo ""

echo "5. GET /verification/:wallet (after unlink)"
curl -s "${BASE_URL}/verification/${WALLET}" | jq .
