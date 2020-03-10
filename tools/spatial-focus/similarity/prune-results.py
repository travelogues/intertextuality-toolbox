import csv
import sys

import sys
sys.path.append('..')
import config as cfg

'''
Prunes the result jaccard results CSV by removing all rows with a score 
lower than the given threshold.
'''

with open(cfg.SIMILARITY_RESULT_FILE, 'r') as infile, open(cfg.SIMILARTY_RESULTS_FILTERED, 'w') as outfile:
  reader = csv.reader(infile)
  writer = csv.writer(outfile)
  writer.writerow(['Source', 'Target', 'Weight_Variant', 'Weight_Resolved', 'Source_Link', 'Target_Link'])

  skipped = 0
  for row in reader:
    score_variant = float(row[2])
    score_resolved = float(row[3])
    max_score = max(score_variant, score_resolved)
    if (max_score >= cfg.SIMILARITY_FILTER_THRESHOLD):
      row.append(f'http://data.onb.ac.at/ABO/+{row[0]}')
      row.append(f'http://data.onb.ac.at/ABO/+{row[1]}')
      writer.writerow(row)
    else:
      skipped += 1
      sys.stdout.write(f'Skipping row with score {max_score}\r')
      sys.stdout.flush()

  print(f'\nSkipped {skipped} rows')

