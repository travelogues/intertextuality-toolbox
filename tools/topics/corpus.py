from gensim.corpora.dictionary import Dictionary
import glob
import re

'''
A helper class for access to the .txt files in a give folder
'''
class Corpus:

  def __init__(self, folder):
    self.folder = folder

    # Reads a single file and performs minimal cleanup
    def read_file(f):
      with open(f, 'r') as file:
        str = file.read()
        ascii_only = re.sub('[^A-Za-z0-9 ]+', '', str)
        return re.sub('\\s+', ' ', ascii_only)

    # List names of all .txt files in the folder
    filenames = [f for f in glob.glob(folder + '**/*.txt')]

    # List of raw text, read from each txt file in the folder
    self.texts = list(map(lambda f: read_file(f), filenames))

    self.dictionary = Dictionary(self.texts)
    self.corpus = [ self.dictionary.doc2bow(text) for text in self.texts ]

  def get_dict(self):
    return self.dictionary

  def get_corpus(self):
    return self.corpus