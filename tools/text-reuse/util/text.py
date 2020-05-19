import collections
from datasketch import MinHash

DEFAULT_NGRAM_SIZE = 7

class Text:

  def __init__(self, idx_a, idx_b, text):
    self.idx_a = idx_a
    self.idx_b = idx_b
    self.text = text

  def _compute_ngrams(self, ngram_size):
    ngrams = []

    for idx in range(0, len(self.text) - ngram_size + 1):
      ngram = self.text[idx : idx + ngram_size].encode('utf-8')
      ngrams.append(ngram)

    return ngrams

  def id(self):
    return f'{self.idx_a},{self.idx_b}'
    
  def minhash(self, ngram_size = DEFAULT_NGRAM_SIZE):
    mh = MinHash(num_perm=128)

    ngrams = self._compute_ngrams(ngram_size)
    for ngram in ngrams:
      mh.update(str(ngram).encode('utf-8'))
    
    return mh