import json

"""
The coverage map has the following shape:

[
  {
    a: {
      start: ..., end: ..., text: ...
    },
    b: {
      start: ..., end: ..., text: ...
    }
  }, ...
]

New passages get appended to the map or merged with
existing passages in case of partial overlap in both
documents.
"""
class CoverageMap:

  def __init__(self):
    self.coverage_map = {}

  """
  Queries the map for the existing intersecting passage pair 
  for the given new passage pair, or returns None if map doesn't
  have an intersecting pair. Note: intersecting means that there
  has to be an intersection for *both* passages of the pair. 
  """
  def _find_intersecting(self, passage_a, passage_b):
    
    def intersects(a, b):
      return a['end'] > b['start'] and a['start'] < b['end']

    return next((idx for idx, pair in enumerate(self.coverage_map) if intersects(passage_a, pair['a']) and intersects(passage_b, pair['b'])), -1)


  """
  Merges the given new passages into the existing_pair.
  """
  def _merge(self, existing_pair, passage_a, passage_b):

    def merge_one(a, b):
      start_passage = a if a['start'] < b['start'] else b
      end_passage = a if a['end'] > b['end'] else b

      text = start_passage['text'] if start_passage == end_passage \
        else start_passage['text'][:end_passage['start']] + end_passage['text']

      return { 'start': start_passage['start'], 'end': end_passage['end'], 'text': text }

    return {
      'a': merge_one(existing_pair['a'], passage_a),
      'b': merge_one(existing_pair['b'], passage_b)
    }


  """
  Adds a new pair of passages to the map
  """
  def add_passages(self, passage_pair):
    """
    exists_at = self._find_intersecting(passage_pair['a'], passage_pair['b'])

    if exists_at > -1:
      existing = self.coverage_map[exists_at]
      self.coverage_map[exists_at] = self._merge(existing, passage_pair['a'], passage_pair['b'])
    else:
    """
    id = f"{passage_pair['a']['start']}-{passage_pair['a']['end']}"
    self.coverage_map[id] = passage_pair


  """
  Checks if the pair of passages is fully covered in this map
  """
  def is_fully_covered(self, index_a, index_b, length):
    """
    def covers(pair):
      return pair['a']['start'] <= index_a and pair['a']['end'] >= index_a + length and \
        pair['b']['start'] <= index_b and pair['b']['end'] >= index_b + length
    
    return False if next((pair for pair in self.coverage_map if covers(pair)), None) == None else True
    """
    return False

  def get_passages(self):
    return list(self.coverage_map.values())

  def write_to_file(self, filename):
    with open(filename, 'w') as outfile:
      json.dump(list(self.coverage_map.values()), outfile, indent=2)
