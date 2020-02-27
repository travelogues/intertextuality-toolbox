# Travelogues Intertextuality Toolbox

This repository contains scripts and helpers to study intextual relations in the 
books of the [Travelogues Corpus](https://github.com/travelogues/travelogues-corpus).

__!!! Work in progress !!!__

## Tools

The tools folder contains scripts and helpers for studying intertextual relations between texts.

- `text-reuse` contains code to detect verbatim text re-use
- `spatial-focus` contains tools for geocoding and studying the spatial focus of texts
- `topics` contains helpers for topic modelling 

Detailed descriptions can be found in the README files in the specific subfolders.

## Sample Data

The `sample-data` folder contains useful test material, sampled from the corpus.

- `random-samples` 18 random works sampled from the corpus
- `two-related` two travelogues from 17th and 18th century, respectively ([AC08439291](http://data.onb.ac.at/rec/AC08439291) 
  and [AC10001446](http://data.onb.ac.at/rec/AC10001446)) where the later work is known to refer to the earlier one
- `three-17c` three selected travelogues from the 17th century ([AC09750782](http://data.onb.ac.at/rec/AC09750782),
  [AC10232182](http://data.onb.ac.at/rec/AC10232182), [AC10307407](http://data.onb.ac.at/rec/AC10307407))
- `near-duplicates` two selected texts that are known to contain a high amount of text re-use (~20%)

## Examples

Contains sample results.

## TODO

- Plot similarity CSVs as networks
- Plot similarity CSVs as histograms
- Implement spatial similarity through a nearest-neighbour approach
- Draft a report/workshop paper
