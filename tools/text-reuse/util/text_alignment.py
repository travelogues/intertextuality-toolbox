import sys
from util.corpus import read_file
from util.ngram_similarity import create_one_dictionary
import textdistance

'''
Python port of the BLAST-based alignment method, as implemented 
by Mees Gelein in JavaScript:

https://github.com/MGelein/text-comparison

Paul Vierthaler and Mees Gelein, "A BLAST-based, Language-agnostic 
Text Reuse Algorithm with a MARKUS Implementation and Sequence 
Alignment Optimized for Large Chinese Corpora," 
Journal of Cultural Analytics. March 18, 2019. 
DOI: 10.31235/osf.io/7xpqe
'''

MAX_STRIKES = 10 # The higher this value, the more 'fuzzyness' is allowed between equivalent passages

MIN_PASSAGE_LENGTH = 65 # Discard all equivalent passages short than that

'''
Aligns equivalent passages in the two given text files,
using n-grams of length n_gram_size as a basis.
'''
def align_text(text_a, text_b, ngram_size):
    aligned_passages = []
    
    dict_a = create_one_dictionary(text_a, ngram_size, 0)
    dict_b = create_one_dictionary(text_b, ngram_size, 1)

    ngrams_a = list(dict_a.keys())
    ngrams_b = set(dict_b.keys())

    shared_ngrams = list(filter(lambda x: x in ngrams_b, ngrams_a))

    # text_a = read_file(file_a)
    # text_b = read_file(file_b)

    # expand all n-grams 
    print(f'Expanding {len(shared_ngrams)} shared n-grams')
    ctr = 0

    for shared_ngram in shared_ngrams:
        all_occurrences_a = dict_a[shared_ngram]
        all_occurrences_b = dict_b[shared_ngram]

        for index_a in all_occurrences_a:
            for index_b in all_occurrences_b:
                passages = expand(text_a, text_b, index_a, index_b, ngram_size)
                if len(passages['a']['text']) > MIN_PASSAGE_LENGTH:
                        aligned_passages.append(passages)
            
        ctr += 1
        # sys.stdout.write(f'{ctr} of {len(shared_ngrams)}\r')
        # sys.stdout.flush()

    return aligned_passages

'''
Expands the shared ngram at the given index positions of text_a 
and text_b to the maximum equivalent passage, according to the
method by Vierthaler and Gelein.
'''
def expand(text_a, text_b, index_a, index_b, ngram_size):
    strikes_remaining = MAX_STRIKES
    match_length = ngram_size

    # hold the currently matched passages from text_a and text_b
    passage_a = ''
    passage_b = ''

    is_direction_left = True
    previous_similarity = 0

    while index_a > 0 and index_b > 0 and index_a + match_length < len(text_a) and index_b + match_length < len(text_b):
        passage_a = text_a[index_a : index_a + match_length]
        passage_b = text_b[index_b : index_b + match_length]
        similarity = similarity_levenshtein(passage_a, passage_b)

        if not is_direction_left:
            index_a -= 1 # extend window to right direction
            index_b -= 1
        
        match_length += 1

        # see if the match is improving or not
        if similarity < previous_similarity:
            strikes_remaining -= 1
        elif similarity > previous_similarity and strikes_remaining < MAX_STRIKES:
            strikes_remaining += 1

        # when strikes reach 0, first expand to other direction, then break
        if strikes_remaining == 0:
            if is_direction_left:
                is_direction_left = False
                strikes_remaining = MAX_STRIKES
            else:
                break

        previous_similarity = similarity

    return { 
        'a': { 'start': index_a, 'end': index_a + match_length, 'text': passage_a },
        'b': { 'start': index_b, 'end': index_b + match_length, 'text': passage_b }
    }


'''
Compute a simple string similarity score
''' 
def similarity_simple(passage_a, passage_b):
    same_chars = 0
    l = len(passage_a)

    for idx in range(0, l):
        if passage_a[idx] == passage_b[idx]:
            same_chars += 1
    
    return same_chars / l

'''
Compute an enhanced similarity score, based on Levenshtein distance.
Note that this method is slower than compute_similarity, but will
yield better results for our purposes (i.e. western languages)
'''
def similarity_levenshtein(passage_a, passage_b):
    distance = textdistance.levenshtein(passage_a, passage_b)
    if distance == 0:
        return 1
    else:
        return 1 / distance