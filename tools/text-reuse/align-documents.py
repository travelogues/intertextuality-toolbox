from util.text_alignment import align_files

'''
Aligns equivalent text passages in the two given txt files.
'''

INPUT_FILE_A = '../../sample-data/near-duplicates/Z168351701.txt'
INPUT_FILE_B = '../../sample-data/near-duplicates/Z185144009.txt'

OUTPUT_FILE = './results/alignment.json'

# Size of the n-grams to use as a basis
# Recommended: 8
NGRAM_SIZE = 8

align_files(INPUT_FILE_A, INPUT_FILE_B, OUTPUT_FILE, NGRAM_SIZE)