// Import the Google Cloud client library using default credentials
const {BigQuery} = require('@google-cloud/bigquery');
const keyParts = [process.env.KEY_1, process.env.KEY_2, process.env.KEY_3, process.env.KEY_4, process.env.KEY_5, process.env.KEY_6, process.env.KEY_7, process.env.KEY_8];
console.log(keyParts.join(''));
console.log(typeof(keyParts.join('')));
console.log(process.env.PROJECT_ID);
console.log(typeof(process.env.PROJECT_ID));
console.log(process.env.CLIENT_EMAIL);
console.log(typeof(process.env.CLIENT_EMAIL));
const bigquery = new BigQuery( {
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: keyParts.join('')
    }
  })

async function query() {
    // Queries the U.S. given names dataset for the state of Texas.

    const query = `SELECT *
    FROM \`ReportingTrends.economic_tsne\`
    LIMIT 100`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
        query: query,
        // Location must match that of the dataset(s) referenced in the query.
        location: 'US',
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // Print the results
    return rows;
}

exports.handler = function(event, context, callback) {
    query()
      .then(response => {
          callback(null, {
              statusCode: 200,
              body: JSON.stringify(response),
          })
      })
      .catch(err => {
        console.log(err)
      })
}
