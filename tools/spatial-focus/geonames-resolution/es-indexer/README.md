# ElasticSearch Indexer

A simple utility to initialize an ElasticSearch (v7.x) index with a Linked Places
dumpfile built via the [Recogito GeoNames Packager](https://github.com/pelagios/recogito-geonames-packager).

- `npm run delete_index` to delete and existing index
- `npm run init_index` to init the index with a basic Linked Places schema
- `npm run build_index` to populate the index from the LP file

Edit the file `config.json` according to your environment settings.