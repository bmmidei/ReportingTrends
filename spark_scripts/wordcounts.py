from pyspark import SparkConf, SparkContext
from google.cloud import storage
import json
from datetime import datetime

sc = SparkContext.getOrCreate()
months = sc.wholeTextFiles('gs://big_data_econ/articles_subset/*.json')

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

word_counts = articles.map(lambda article: get_year_word_count(article))

word_counts = word_counts.filter(lambda x: x[1] > 0)


year_word_counts = word_counts.mapValues(lambda x: (x, 1))
year_word_counts = year_word_counts.reduceByKey(lambda x, y: (x[0] + y[0], x[1] + y[1]))
avg_year_word_counts = year_word_counts.mapValues(lambda x: (x[0] // x[1], x[1]))
df = avg_year_word_counts.map(lambda x: (x[0], x[1][0], x[1][1])).toDF()


df = df.selectExpr("_1 as year", "_2 as avg_wordcount", "_3 as total_articles")
df.show()
