import pandas as pd 

class Metadata:

  def __init__(self, basepath):
    # CSVs don't necessarily have the same format...
    df16 = pd.read_csv(f'{basepath}/TravelogueD16_2020-04-30.csv', delim_whitespace=False, sep=',', quotechar='"')
    df17 = pd.read_csv(f'{basepath}/TravelogueD17_2020-05-04.csv', delim_whitespace=False, sep=',', quotechar='"')
    # df18 = pd.read_csv(f'{basepath}/TravelogueD18_Orient_2020-05-20.csv', delim_whitespace=False, sep=',', quotechar='"')

    self.barcode_index = {}

    def build_index(dataframe):
      for _, row in dataframe.iterrows():
        barcodes = row['Barcode']

        if not pd.isnull(barcodes):
          for code in barcodes.split(';'):
            self.barcode_index[code] = row

    build_index(df16)
    build_index(df17)
    # build_index(df18)

  def get_meta(self, barcode):
    if barcode in self.barcode_index:
      metadata = self.barcode_index[barcode]
    
      return {
        'identifier': metadata['Systemnummer'],
        'work_title': metadata['Werktitel'] if not pd.isnull(metadata['Werktitel']) else '',
        'main_title': metadata['Haupttitel ; Titelzusatz ; Verantwortlichkeitsangabe'],
        'year': metadata['Erscheinungsjahr normiert'],
        'marker': metadata['Marker']
      }