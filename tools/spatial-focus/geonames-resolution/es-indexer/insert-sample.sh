curl -XPOST http://localhost:9200/geonames/_doc/ -H "Content-Type: application/json" -d '{
  "@id":"http://sws.geonames.org/2766983",
  "type":"Feature",
  "properties":{
    "title":"Rufling",
    "ccodes":[ "AT" ]
  },
  "names":[{
    "toponym":"Rufling"
  }],
  "geometry":{
    "type":"Point",
    "coordinates":[
      14.21674,
      48.27839
    ]
  }
}'