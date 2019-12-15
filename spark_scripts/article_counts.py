from pyspark import SparkConf, SparkContext
import json
from datetime import datetime

SAVE_DIR = 'article_counts'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)


def get_year(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    return (year)


years = articles.map(lambda article: get_year(article))

# Aggregate the total number of articles written each year
years = years.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)

df = years.toDF()
df = df.selectExpr('_1 as year', '_2 as count')

# Save data to Google Cloud Bucket
df.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)