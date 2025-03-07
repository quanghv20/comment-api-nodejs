const axios = require("axios");

const SolrHandler = {
  callSolr: async function (nid) {
    const solrUrl = `https://solr.vov.vn/solr/vov/select?q=index_id:article, its_nid:${nid}`;

    try {
      const response = await axios.get(solrUrl);

      return response.data.response.docs[0];
    } catch (error) {
      console.error("Error querying Solr:", error.message);
      return null;
    }
  },
};

module.exports = SolrHandler;
