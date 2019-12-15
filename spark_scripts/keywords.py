from pyspark import SparkConf, SparkContext
import json
from datetime import datetime

SAVE_DIR = 'keywords'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)

def get_year_keywords(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    if 'keywords' in article and article['keywords']:
        return [(year, word['value'].lower()) for word in article['keywords']]
    else:
        return []

# Map keywords to (year, keyword) format
keywords = articles.flatMap(lambda article: get_year_keywords(article))

# Aggregate keyword counts for each year
year_keywords = keywords.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)

# Write to dataframe
df = year_keywords.map(lambda x: (x[0][0], x[0][1], x[1])).toDF()
df = df.selectExpr('_1 as year', '_2 as keyword', '_3 as count')

# Filter by most frequent keywords
keywords = set([row['keyword'] for row in df.filter(df['count']>1000).collect()])
df_filtered = df.filter(df['keyword'].isin(keywords))

# Save data to Google Cloud Bucket
df_filtered.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)
