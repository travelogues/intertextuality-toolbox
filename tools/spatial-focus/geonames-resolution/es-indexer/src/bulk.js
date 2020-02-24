const axios = require('axios');

const { 
  INDEX_HOST,
  INDEX_NAME
} = require('./config.json');

const createBulkPayload = function(records) {
  return records.reduce(function(result, record) {
    const meta = {
      index: { _index: INDEX_NAME }
    };

    return `${result}${JSON.stringify(meta)}\n${JSON.stringify(record)}\n`
  }, '');
};

const indexRecords = function(records) {
  const payload = createBulkPayload(records);

  try {
    return axios.post(`${INDEX_HOST}/_bulk`, payload, {
      headers: { 'Content-Type': 'application/x-ndjson' },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
  } catch(error) {
    console.log(`Error indexing batch`);
    console.log(error);
    return Promise.reject(error);
  }
}

module.exports = { indexRecords };
