curl -XDELETE http://localhost:9200/geonames
curl -XPUT http://localhost:9200/geonames -d @mappings.json -H "Content-Type: application/json"