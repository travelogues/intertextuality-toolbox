import re
import glob

'''
A bunch of helpers and shorthands for listing, loading & cleaning files.
'''
def list_files(path):
  print(f'Loading from {path}')
  return [f for f in glob.glob(path + '**/*.txt')]

def list_files_in_folders(paths):
  list_of_list = map(lambda path: [f for f in glob.glob(path + '**/*.txt')], paths)
  flattened = [item for sublist in list_of_list for item in sublist]
  return flattened

def clean_text(str):
  ascii_only = re.sub('[^A-Za-z0-9 ]+', '', str)
  return re.sub('\\s+', ' ', ascii_only)

def read_file(f):
  with open(f, 'r') as file:
    return clean_text(file.read())

