import glob
import json

'''
A helper to compute different types of similarities from spatial analysis
results:

- Jaccard similarity based on the toponyms identfied via NER
- Jaccard similarity based on the geo-resolved toponyms (i.e. using gazetteer URIs rather than place names)
- A similarity score based on geographical nearest neighbor distance distribution
'''

SOURCE_FOLDER = '../../../results/two-related'
RESULT_FILE = '../../../results/two-related/similarities_spatial.csv'

# Helper to get the barcode from the full filepath
def barcode_from_path(p):
  return p[p.rfind('/') + 1:p.index('.', p.rfind('/'))]

# Reads the GeoJSON file and returns just the list of features
def load_features(geojson_file):
  with open(geojson_file) as f:
    geojson = json.load(f)
    return geojson['features']

# Maps the feature list to a list of distinct source_labels
def get_distinct_source_labels(features):
  return list(set(map(lambda f: f['properties']['source_label'], features)))

# Maps the feature list to a list of distinct places (i.e. gazetteer URIs)
def get_distinct_places(features):
  return list(set(map(lambda f: f['properties']['gazetteer_uri'], features)))

# Computes Jaccard similarity score for two sets of strings
def jaccard(list_a, list_b):
  shared_terms = list(filter(lambda x: x in list_b, list_a))
  shared_count = len(shared_terms)
  total_count = len(list_a) + len(list_b) - shared_count
  return 1 if total_count == 0 else shared_count / total_count

# Helper to run pair-wise execution between all elements in the list
def execute_pairwise(elements, fn):
  l = len(elements) # Shorthand

  for idxA in range(0, l):
    for idxB in range(idxA + 1, l):
      fn(elements[idxA], elements[idxB])




geojson_files = [f for f in glob.glob(SOURCE_FOLDER + '**/*.geojson')]

# Data structure to hold all data we need for pair-wise jaccard scoring
data = list()

for f in geojson_files:
  features = load_features(f)

  data.append({ 
    'filename' : f,
    'barcode': barcode_from_path(f),
    'source_labels' : get_distinct_source_labels(features),
    'places' : get_distinct_places(features)
  })

with open(RESULT_FILE, 'w') as outfile:

  # Now run pair-wise comparison
  def compute_jaccard(a, b):
    score_labels = jaccard(a['source_labels'], b['source_labels'])
    score_places = jaccard(a['places'], b['places'])
    outfile.write(f"{a['barcode']},{b['barcode']},{score_labels},{score_places}\n")

  execute_pairwise(data, compute_jaccard)

  print('Done')
