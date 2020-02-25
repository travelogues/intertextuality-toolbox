import json
import requests

SOURCE_NER_FILE = '../../../examples/stanford-ner-out-105572305.txt.jsonl'

def query(toponym):
  return {
    'query' : {
      'bool' : {
        'must' : [
          { 'term' : { 'names.toponym' : toponym } }
        ],
        'should' : [
          { 'term' : { 'properties.title' : toponym } },
          { 'match' : { 'properties.feature_class' : { 'query' : 'P', 'boost' : 50000 } } },
          { 'match' : { 'properties.feature_code' : { 'query' : 'PPLC', 'boost' : 50000 } } },
          { 'function_score' : { 'field_value_factor' : { 'field' : 'properties.population', 'factor' : 0.0001 } } }
        ]
      }
    },
    'size' : 1
  }

# Read JSONL file line by line and collect LOCATION tokens into a set
with open(SOURCE_NER_FILE, 'r') as infile:

  distinct_locations = set()

  for line in infile.readlines():
    record = json.loads(line)
    locations = list(filter(lambda t: t['tag'] == 'LOCATION', record['tokens']))

    for token in locations:      
      distinct_locations.add(token['chars'])

  locations_sorted = list(distinct_locations)
  locations_sorted.sort()

  print(f'Got {len(locations_sorted)} locations')

  # Assemble a GeoJSON feature collection as final result
  features = []

  for location in locations_sorted:
    r = requests.post('http://localhost:9200/geonames/_search', json=query(location.lower()))
    response = r.json()

    total_hits = response['hits']['total']['value']
    if (total_hits > 0):
      first_hit = response['hits']['hits'][0]['_source']

      feature = {
        'type': 'Feature',
        'properties': {
          'source_label': location,
          'gazetteer_title': first_hit['properties']['title'],
          'gazetteer_uri': first_hit['@id'],
          'gazetteer_population': first_hit['properties']['population']
        },
        'geometry': first_hit['geometry']
      }

      # TODO number of references in the text
      
      features.append(feature)
  
  geojson = {
    'type': 'FeatureCollection',
    'features': features
  }

  print(json.dumps(geojson, indent=2))
      

    