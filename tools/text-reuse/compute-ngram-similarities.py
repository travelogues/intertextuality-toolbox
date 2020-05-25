from util.corpus import list_files_in_folders
from util.ngram_similarity import compare, create_one_dictionary, compare_two

'''
Computes the pair-wise Jaccard n-gram similarity for the text files in
the given input folder and creates a CSV file that is compatible with Gephi.

This implementation does NOT do fingerprinting with LSH. See the notebook

compute-pagewise-lsh.ipynb

for an implementation.
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

compare(files, NGRAM_SIZE, OUTPUT_FILE)
