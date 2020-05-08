from util.corpus import list_files_in_folders
from util.ngram_similarity import compare, create_one_dictionary, compare_two

from datasketch import MinHash, MinHashLSH

'''
Computes the similarity scores for the text files in
the given input folder and creates a CSV file that
is compatible with Gephi.
'''

INPUT_FOLDERS = [ '/home/simonr/Workspaces/travelogues/travelogues-corpus/17th_century/books' ]
"""
INPUT_FOLDERS = [
  '/home/simonr/Workspaces/travelogues/travelogues-corpus/16th_century/books',
  '/home/simonr/Workspaces/travelogues/travelogues-corpus/17th_century/books',
  '/home/simonr/Workspaces/travelogues/travelogues-corpus/18th_century/books'
]
"""

# Length of the n-grams to use as the basis
# Recommended: 8
NGRAM_SIZE = 8

# Write output CSV to this file
# OUTPUT_FILE = '../../results/two-related/similarities_ngram.csv'
OUTPUT_FILE = '/home/simonr/Workspaces/travelogues/travelogues-corpus/similarities_ngram_17C.csv'

files = list_files_in_folders(INPUT_FOLDERS)
print(f'Got {len(files)} files')

"""
minhashes = []
dictionaries = []

for idx, f in enumerate(files):

  barcode = f[f.rfind('/') + 1:f.index('.', f.rfind('/'))]
  
  mh = MinHash(num_perm=20)
  shingles = set(create_one_dictionary(f, NGRAM_SIZE, idx).keys())
  
  for shingle in shingles:
    mh.update(str(shingle).encode('utf-8'))

  dictionaries.append(shingles) 
  minhashes.append(mh)

set_a = set(minhashes[0].digest())
set_b = set(minhashes[1].digest())
print(set_a)
print(set_b)
print(compare_two(dictionaries[0], dictionaries[1]))
print(minhashes[1].jaccard(minhashes[0]))
print(compare_two(set_a, set_b))
"""

compare(files, NGRAM_SIZE, OUTPUT_FILE)
