# Intertextuality

Various scripts and pieces of code for computing and analysing intextuality statistics.

## `python compute-similarities`

Computes pair-wise similarity scores for all text files in the `INPUT_FOLDER`. The score
is the Jaccard similarity for the sets of distinct n-grams in the documents. Results are
written to the `OUTPUT_FILE` in CSV format.

- __Warning #1:__ scores are computed for __every__ document against __every__ document
in the folder. While each individual computation is pretty fast, there's combinatorial 
explosion. The process will take a while for larger corpora. (Reminder: `n` files 
require `n * (n - 1) / 2` comparisons).

- __Warning #2:__ all processing (currently) happens in memory.

## `python plot-similarities`

Plots the contents of the CSV result file from `compute-similarites`
as combined histogram and boxplot.

## `python prune-result-csv` 

An optional helper to trim the result CSV. Removes all pairings where
the score is below the `MIN_SCORE` threshold. Note that you can set
different input and output files, so that the original results are not
overwritten.

## `python align-documents`

The main act. Takes two input documents, and generates pairs of equivalent
text passages, according to the approach by Vierthaler and Gelein.

```
Paul Vierthaler and Mees Gelein, "A BLAST-based, Language-agnostic Text Reuse
Algorithm with a MARKUS Implementation and Sequence Alignment Optimized for 
Large Chinese Corpora", Journal of Cultural Analytics. March 18, 2019. 
DOI: 10.31235/osf.io/7xpqe
```

## TODO

* It may be necessary to create version of `compute-similarities` that splits
  the computation up into subtasks. Less memory consumption (and the [potential
  for parallelization](https://stackoverflow.com/questions/26596714/python-writing-to-a-single-file-with-queue-while-using-multiprocessing-pool/26598452))

* Speed up `align-documents` by adding a coverage map to avoid computing
  duplicate n-gram expansions.

## Acknowledgements

Thanks go out to Paul Vierthaler and, especially, Mees Gelein 
for their work and Mees' active assistance in re-using his 
[JavaScript code](https://github.com/MGelein/text-comparison) 
and supporting our work porting it to Python.