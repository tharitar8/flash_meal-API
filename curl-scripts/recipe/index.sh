#!/bin/sh

API="http://localhost:4741"
URL_PATH="/recipeslist"

curl "${API}${URL_PATH}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"
  --data '{
    "recipelist": {
      "owner": "'"${OWNER}"'"
    }
  }'
echo