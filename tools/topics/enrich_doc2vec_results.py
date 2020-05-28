import csv
import math
import pandas as pd 

# Metadata CSV file - this is where the enrichment data comes from 
METADATA_FILE = '../../results/TravelogueD16_2020-04-30.csv'

INPUT_FILE = '../../results/16C/doc2vec_clusters_16.csv'
OUTPUT_FILE = '../../results/16C/doc2vec_clusters_16_with_metadata.csv'

# Metadata by barcode
metadata_index = {}

def load_metadata():
  df = pd.read_csv(METADATA_FILE, delim_whitespace=False, sep=',', quotechar='"')
  for _, row in df.iterrows():
    barcodes = row['Barcode']

    if not pd.isnull(barcodes):
      for code in barcodes.split(';'):
        metadata_index[code] = row

def enrich_csv():
  enriched = []

  with open(INPUT_FILE, 'r') as infile:
    csv_reader = csv.reader(infile, delimiter=',', quotechar='"')
    next(csv_reader) # Skip header

    for row in csv_reader:
      barcode = row[1]
      if barcode in metadata_index:
        metadata = metadata_index[barcode]

        # We want to append the following metadata props
        identifier = metadata['Systemnummer']
        work_title = metadata['Werktitel'] if not pd.isnull(metadata['Werktitel']) else '' 
        main_title = metadata['Haupttitel ; Titelzusatz ; Verantwortlichkeitsangabe']
        year = metadata['Erscheinungsjahr normiert']
        marker = metadata['Marker']

        enriched.append(row + [ identifier, year, marker, work_title, main_title ])
      else:
        print(f'Not found: {barcode}')

  enriched_df = pd.DataFrame(enriched, columns = ['cluster', 'barcode', 'abo_url', 'system_id', 'year', 'marker', 'work_title', 'main_title'])
  enriched_df.to_csv(OUTPUT_FILE, index = False)

load_metadata()
enrich_csv()
