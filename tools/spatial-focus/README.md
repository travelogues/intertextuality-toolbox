# Travelogues Intertextuality Toolbox: Spatial Focus

Tools and helpers for geocoding and studying and comparing the spatial focus of texts.

## `ner-stanford`

Command-line app to run Named Entity Recognition on the `txt` files in a folder using
the Stanford parser and the standard German language model.

Produces JSONL result files, one file per source document, with the following structure
per record:

```json
{
  "sentence": "...",
  "tokens": [
    { "chars": "...", "label": "....", "offset": 123 }
  ]
}
```