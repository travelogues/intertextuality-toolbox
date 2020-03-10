import sys
from util.corpus import read_file

'''
Document similarity computation based on k-shingling.
Partially based on the JavaScript code by Mees Gelein:
https://github.com/MGelein/text-comparison
'''

def create_one_dictionary(file, n, idx, record_indices = True):
  sys.stdout.write(f'Creating dict {idx}\r')
  sys.stdout.flush()

  dict = {}
  text = read_file(file)

  for idx in range(0, len(text)):
      gram = text[idx: idx + n].encode('ascii')
      if gram in dict:
        if record_indices:
          dict[gram].append(idx)
      else:
        if record_indices:
          dict[gram] = [ idx ]
        else: 
          dict[gram] = []

  return dict


def compare_two(a, b):
  ngrams_a = a # list(a.keys())
  ngrams_b = b # set(b.keys())

  shared_ngrams = list(filter(lambda x: x in ngrams_b, ngrams_a))

  shared_count = len(shared_ngrams)
  total_count = len(ngrams_a) + len(ngrams_b) - shared_count

  jaccard = 1 if total_count == 0 else shared_count / total_count
  return jaccard


def compare(files, ngram_size, outfile):
  dicts = list(map(lambda t: create_one_dictionary(t[1], ngram_size, t[0] + 1, False), enumerate(files)))
  l = len(files) # Shorthand

  total_comparisons = int(l * (l - 1) / 2)
  print(f'Running pairwise comparison - {total_comparisons} comparisons')

  with open(outfile, 'w') as out:
    out.write('Source,Target,Weight\n')
    progress = 0
    for idxA in range(0, l):
      for idxB in range(idxA + 1, l):
        score = compare_two(dicts[idxA], dicts[idxB])

        out.write(f'{files[idxA]},{files[idxB]},{score}\n')
        progress += 1

        sys.stdout.write(f'{progress} of {total_comparisons}\r')
        sys.stdout.flush()

    out.close()
    print('\nDone')
