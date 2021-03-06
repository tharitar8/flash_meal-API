#!/bin/sh

API="http://localhost:4741"
URL_PATH="/recipes"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{
    "recipe": {
      "owner": "'"${OWNER}"'"
    }
  }'
echo