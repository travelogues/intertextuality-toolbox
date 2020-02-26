from util.corpus import list_files
from util.ngram_similarity import compare

'''
Computes the similarity scores for the text files in
the given input folder and creates a CSV file that
is compatible with Gephi.
'''

INPUT_FOLDER = '../../sample-data/two-related'

# Length of the n-grams to use as the basis
# Recommended: 8
NGRAM_SIZE = 8

# Write output CSV to this file
OUTPUT_FILE = '../../results/two-related/similarities_ngram.csv'

files = list_files(INPUT_FOLDER)
print(f'Got {len(files)} files')
compare(files, NGRAM_SIZE, OUTPUT_FILE)
