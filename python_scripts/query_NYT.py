import requests
from google.cloud import storage
import json
import os

# Instantiate Google Cloud Storage connection
storage_client = storage.Client.from_service_account_json(
    'service_account_credentials.json')
bucket = storage_client.get_bucket('big_data_econ')

KEY =  # Insert NYT developer API key
months = [str(x) for x in list(range(1, 13))]
years = [str(x) for x in list(range(1851, 2020))]


def parse_response(res, year, month):
    res = res.json()
    num_articles = res['response']['meta']['hits']
    data = res['response']['docs']
    fname = 'y{}_m{}_{}'.format(year, month, num_articles)

    # Store json data in local file, upload to GCP, then delete the local file
    json_file = json.dumps(data)
    blob = bucket.blob('articles/' + fname)
    with open(json_file) as f:
        blob.upload_from_file(f)
    os.remove(fname)


# Query data for all available months
for year in years:
    for month in months:
        req = 'https://api.nytimes.com/svc/archive/v1/{}/{}.json?api-key={}'.format(
            year, month, KEY)
        res = requests.get(req)
        if res:
            # Store data in GCP bucket
            parse_response(res, year, month)
        else:
            # no data for this month
            print('No data available for month {}, year {}'.format(month, year))

