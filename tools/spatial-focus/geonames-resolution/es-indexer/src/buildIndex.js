const axios = require('axios');
const fs = require('fs');
const { indexRecords } = require('./bulk');

const { 
  GAZETTEER_PATH, 
  MAX_PARALLEL_REQUESTS
} = require('./config.json');

/** Helper: chunk array into batches of size N **/
const chunkArray = (arr, n) => {
  const chunked = [];
  
  let index = 0;
  while (index < arr.length) {
    chunked.push(arr.slice(index, n + index));
    index += n;
  }

  // Remainder
  chunked.push(arr.slice(index));
  return chunked;
}

const app = async function() {
  console.log('Reading from file');

  const lines = fs.readFileSync(GAZETTEER_PATH, 'utf-8')
    .split('\n')
    .filter(function(str) { return str.trim().length > 0 });

  const chunks = chunkArray(lines, MAX_PARALLEL_REQUESTS);

  for (const chunk of chunks) {
    try {
      const records = chunk.map(function(str) { return JSON.parse(str); });
      await indexRecords(records);
    } catch(e) {
      console.log(e);
    }
  }
  
  console.log('Done');
}

app();