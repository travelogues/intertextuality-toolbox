const axios = require('axios');

const { 
  INDEX_HOST,
  INDEX_NAME
} = require('./config.json');

const INDEX_PATH = `${INDEX_HOST}${INDEX_NAME}`;

/** Indexes one document **/
const indexRecord = function(record) {  
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

module.exports = { indexRecord };