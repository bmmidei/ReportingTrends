// Import the Google Cloud client library using default credentials
const {BigQuery} = require('@google-cloud/bigquery');
const tempKey = process.env.KEY_1 + process.env.KEY_2 + process.env.KEY_3 + process.env.KEY_4 + process.env.KEY_5 + process.env.KEY_6 + process.env.KEY_7 + process.env.KEY_8;

// Key reformatting for newlines
const googleApiKey = tempKey.replace(new RegExp("\\\\n", "\g"), "\n");

// Instantiates a BigQuery Client
const bigquery = new BigQuery( {
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: googleApiKey
    }
  });

async function query() {
    // Queries the Economic Data Table in BigQuery
    const query = `SELECT *
    FROM \`ReportingTrends.liwc\`
    WHERE cast(a.year as int64)>=1920
    ORDER BY year
    LIMIT 1000`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: query,
        location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // Return
    return rows;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
};

exports.handler = function(event, context, callback) {
    query()
      .then(response => {
          callback(null, {
              statusCode: 200,
              body: JSON.stringify(response),
              headers: headers,
          })
      })
      .catch(err => {
        console.log(err)
      })
};
