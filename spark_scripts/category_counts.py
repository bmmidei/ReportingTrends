from pyspark import SparkConf, SparkContext
from google.cloud import storage
import json
from datetime import datetime

SAVE_DIR = 'categories'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles_subset/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)

def get_year_categories(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    news_desk = get_field(article, field='news_desk')
    return (year, news_desk)

def get_field(data, field):
    if field in data and data[field] and data[field]!='None':
        return data[field].lower()
    else:
        return ''

# Aggregate category counts for each year
categories = articles.map(lambda article: get_year_categories(article))

# Calculate average article wordcount for a each year
year_categories = categories.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)

df = year_categories.map(lambda x: (x[0][0], x[0][1], x[1])).toDF()
df = df.selectExpr('_1 as year', '_2 as category', '_3 as count')

# Save data to Google Cloud Bucket
df.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)