// Import the Google Cloud client library using default credentials
const {BigQuery} = require('@google-cloud/bigquery');
const key = process.env.KEY_1 + process.env.KEY_2 + process.env.KEY_3 + process.env.KEY_4 + process.env.KEY_5 + process.env.KEY_6 + process.env.KEY_7 + process.env.KEY_8;
console.log(key);
console.log(typeof(key));
const bigquery = new BigQuery( {
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCR/Im78z/xDxmC\nkmnXRIwgAIL0Uq3JwCV/LUq5JgMvOHFs+dzPDLEtSQS7LwLSz826/evuxc0nvkog\nGoNwI2wqPQ4RR5ggQu9dGwPGO3hpeXX+ntc2ZW/pU6FeyRwncztpBLpC8xr58k61\nEmEd5o6O5l7THMdhLJUawj4CHRPTbcJppm2Rf3gu5Vm8OYx+mRBFcY7Y9ZpWtT+g\nB5urtu01WCabYZy0ztpBrvdxwadrStQu12+5NkYPamFeh+eYtMJVM5I07cHq9zFD\nSq6jU3zWDiifHNn+IldyaAwonRZhw9E3ECG5FdZiGZa6+yS1cNZNS+leznHrYleP\nbuVDpMeVAgMBAAECggEAC37sNq91R82FV/2hFYlJkoSPy18OXd6CZWUi5vkKE6gZ\ncHgtjeVlN1hyZa4SRhkEjZbMwyjy2pAWxLfpxUUY0auspaoyXcn/kOCdd7j7pqyg\noMwPzPIIccJ66Nyj2axuj3rGkxqTM38D+SjJGoJrE/Aqo+u2fJ224RxOJzr0cnfp\n+TMVrQMDKroueLu/CPfeD2s6EUDM5WUtAGpWjCbIB9OOxpKmGzDJztu4MCHDqMGj\njzMyzPJfCZEjDiddLKDGXCkr1F1baoBDBC+mtrtydk+OA5jD5T/PxwuDbQt2c48B\n13OZ2b7LWbZjgvff+z0OWRHS3oPy4rVIjjIlGqNd+QKBgQDIuGSIdbVt1pAz8/Pn\nLTKXpxfgbZjEBMLO/l1s3blqSPIfJUb5DcWYtrsaxiCzcYn2E1DafgPmKlts5qR4\nJRlLCi5wnGMJ9CYlkUw+/eUQj6FFDjkScwEG+/SzqsiR7R0VG+k5Km/Um3NaoUn+\nP+BA0mEBFvZ3dHINMqqG+I3cXQKBgQC6MS+yLx0O6MQBXSnkCHkb4T23kpHYZ/4z\nlnlvZ0259H4CGPYu1xiu7We2bqQ5lUNmgUcppIy4BX3XX3MQNcO4oFO3/z17V1oU\nRGUyv80JA8R87OGSiiPhSsvEs85d1kOUNo/LyAwAu+K0bMLy1uNoa4TiiM+JuqEC\nIDbHvWskmQKBgAECvK7bOOCmte8tCUtetOSCmOIuaxiBlaGJMls7+pUIbP+vJl5W\nrWoJcYO+/6cnqTQuALg47jgYeoFf3/Ai76+rC3TRtMX2DsMdqi6fBKpCruM0ISFw\nps6sMh09fOkPMphKnbAGAK4nYjtQmJjJJY3uAUMKJI+RbImYebdYRQ6ZAoGBAIRn\n6AAxituIYaKKqviTofRWl/oMjBS110q+TjsP3nFH0bgSIjerFM2I3EEaq0SbxeOG\nOaH+d2eB2DypjvzPDxEjSoXFR+aHdvKEtOaDCP7JJBimp77654sWEpQePbnzXflv\nV5DWANsgwZYG5helAvDFzSj/m37ZLhiB6hLeu+u5AoGAcDUyTBv26rU//fq7b0pf\n4YMwYQkiLXbW53NntZ4uWitoeIc9/jGru/TdMEl4gvnY+Cu23NYVFE6fd6OKfC/I\nsqzw87tINl3/LGw+1ubP9PJ3rO95GLCi1Trae2NERzXnZoA5sqXe8HDD754GxmsT\nOvLIS5FTtM6tV2OD+27V1Ys=\n-----END PRIVATE KEY-----\n",
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
