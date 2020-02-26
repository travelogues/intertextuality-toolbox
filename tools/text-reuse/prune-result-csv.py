import csv
import sys

'''
Prunes the result CSV by removing all edges with a score 
lower than the given threshold.
'''

MIN_SCORE = 0.25
INPUT_FILE = '../../results/near-duplicates/similarities_ngram.csv'
OUTPUT_FILE= '../../results/near-duplicates/similarities_ngram_pruned.csv'

with open(INPUT_FILE, 'r') as infile, open(OUTPUT_FILE, 'w') as outfile:
  reader = csv.reader(infile)
  next(reader, None) # Skip headers

  writer = csv.writer(outfile)
  writer.writerow(['Source', 'Target', 'Weight'])

  skipped = 0
  for row in reader:
    score = float(row[2])
    if (score >= MIN_SCORE):
      writer.writerow(row)
    else:
      skipped += 1
      sys.stdout.write(f'Skipping row with score {score}\r')
      sys.stdout.flush()

  print(f'\nSkipped {skipped} rows')

