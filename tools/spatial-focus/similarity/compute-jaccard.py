'''
A helper to compute different types of similarities from spatial analysis
results:

- Jaccard similarity based on the toponyms identfied via NER
- Jaccard similarity based on the geo-resolved toponyms (i.e. using gazetteer URIs rather than place names)
- A similarity score based on geographical nearest neighbor distance distribution
'''

# TODO