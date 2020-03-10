import glob
import re
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from gensim.utils import simple_preprocess

SOURCE_FOLDER = '../../sample-data/random-samples'

stop_words = stopwords.words('german')
stop_words.extend(['vnd', 'mehr', 'wann', 'vnnd', 'fr', 'vn', 'daher', 'denen', 'deren', 'worden'])

def clean_text(str):
  ascii_only = re.sub('[^A-Za-z0-9 ]+', '', str)
  return re.sub('\\s+', ' ', ascii_only)

def read_file(f):
  with open(f, 'r') as file:
    return clean_text(file.read())

def remove_stopwords(texts):
  return [ ' '.join([ word for word in simple_preprocess(str(doc)) if word not in stop_words ]) for doc in texts ]

filenames = [f for f in glob.glob(SOURCE_FOLDER + '**/*.txt')]

data = list(map(lambda f: read_file(f), filenames))
cleaned = remove_stopwords(data)

# Remove punctuation
# cleaned = map(lambda t: re.sub('[,\\.!?]', '', t), data)

# All lowercase
# cleaned = map(lambda t: t.lower, cleaned)


# all
cloud = WordCloud(
  background_color='white', 
  max_words=5000, 
  contour_width=3, 
  contour_color='steelblue',
  width=1024, 
  height=768)

cloud.generate(' '.join(cleaned))
plt.imshow(cloud, interpolation='bilinear')
plt.axis('off')
plt.show()

"""
import spacy 
from spacy.lang.de import German

print('Loading language model')
spacy.load('de_core_news_md')

print('Initializing parser')
parser = German()

# Clean & tokenize text
# Cf. https://towardsdatascience.com/topic-modelling-in-python-with-nltk-and-gensim-4ef03213cd21
def tokenize(text):
  lda_tokens = []
  tokens = parser(text)

  for token in tokens:
    if token.orth_.isspace():
      continue
    else:
      lda_tokens.append(token.lower_)
    
  return lda_tokens

"""



