const axios = require('axios');

const { 
  INDEX_HOST,
  INDEX_NAME
} = require('./config.json');

const term = process.argv[2];

const query = {
  query : {
    bool : {
      must : [
        { term : { "names.toponym" : term } }
      ],
      should : [
        { term : { "properties.title" : term } },
        { match : { "properties.feature_class" : { query : "P", boost : 50000 } } },
        { match : { "properties.feature_code" : { query : "PPLC", boost : 50000 } } },
        { function_score : { field_value_factor: { field : "properties.population", factor : 0.0001 } } }
      ]
    }
  },
  size : 3
};

axios.post(`${INDEX_HOST}${INDEX_NAME}/_search`, query, {
  headers: { 'Content-Type': 'application/json' }
}).then(function(response) {
  const { hits } = response.data;
  const total = hits.total.value;
  const matches = hits.hits.map(function(h) {
    return h._source;
  });

  console.log(`Total hits: ${total}`);
  matches.forEach(function(m) {
    console.log(`${m.properties.title}, ${m['@id']} (pop ${m.properties.population})`);
  });
});