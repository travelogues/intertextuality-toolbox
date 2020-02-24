const axios = require('axios');
const fs = require('fs')

// TODO make a proper config file
const GAZETTEER_PATH = '/home/simonr/Workspaces/pelagios/recogito-geonames-packager/output/geonames_AT.lpf.jsonl';
const INDEX_PATH = 'http://localhost:9200/geonames';

/** Indexes one document **/
const writeToIndex = function(record) {  
  try {
    return axios.post(`${INDEX_PATH}/_doc/`, record, {
      headers: { 'Content-Type': 'application/json' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
  } catch(error) {
    console.log(`Error indexing ${record}`);
    console.log(error);
    return Promise.reject(error);
  }
}

const app = async function() {
  console.log('Reading from file');

  let lines = fs.readFileSync(GAZETTEER_PATH, 'utf-8')
    .split('\n');

  for (const line of lines) {
    try {
      const record = JSON.parse(line);
      await writeToIndex(record);
    } catch(e) {
      console.log(e);
    }
  }
  
  console.log('Done');
}

app();