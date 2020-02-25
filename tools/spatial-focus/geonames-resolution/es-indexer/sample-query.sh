curl -XPOST "http://localhost:9200/geonames/_search?pretty" -H "Content-Type: application/json" -d '{
  "query" : {
    "bool" : {
      "must" : [
        { "term" : { "names.toponym" : "wien" } }
      ],
      "should" : [
        { "term" : { "properties.title" : "wien" } },
        { "term" : { "properties.title" : "wien" } },
        { "match" : { "properties.feature_class" : { "query" : "P", "boost" : 100000 } } },
        { "function_score" : { "field_value_factor": { "field" : "properties.population", "factor" : 0.001 } } }
      ]
    }
  },
  "size" : 1
}'