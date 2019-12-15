from pyspark import SparkConf, SparkContext
import json
from datetime import datetime

SAVE_DIR = 'wordcount'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)

def get_year_word_count(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    if 'word_count' in article and article['word_count']:
        word_count = int(article['word_count'])
    else:
        word_count = 0

    return (year, word_count)

# Map to (year, wordcount) format
word_counts = articles.map(lambda article: get_year_word_count(article))

# Remove articles that do not have a wordcount or wordcount==0
word_counts = word_counts.filter(lambda x: x[1] > 0)

# Calculate average article wordcount for a each year
year_word_counts = word_counts.mapValues(lambda x: (x, 1))
year_word_counts = year_word_counts.reduceByKey(lambda x, y: (x[0] + y[0], x[1] + y[1]))
avg_year_word_counts = year_word_counts.mapValues(lambda x: (x[0] // x[1], x[1]))

# Write to dataframe
df = avg_year_word_counts.map(lambda x: (x[0], x[1][0], x[1][1])).toDF()
df = df.selectExpr('_1 as year', '_2 as avg_wordcount', '_3 as total_articles')

# Save data to Google Cloud Bucket
df.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)