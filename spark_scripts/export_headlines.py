from pyspark import SparkConf, SparkContext
import json
from datetime import datetime

SAVE_DIR = 'headlines'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)

def get_article_headlines(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    if 'headline' in article and article['headline']:
        if 'main' in article['headline'] and article['headline']['main']:
            headline = article['headline']['main']
        else:
            headline = 'NA'
    else:
        headline = 'NA'

    if 'print_page' in article and article['print_page']:
        print_page = article['print_page']
    else:
        print_page = 'NA'

    return (year, print_page, headline)


# Map all articles to (year, print_page, headline) format
headlines = articles.map(lambda article: get_article_headlines(article))


df = headlines.toDF()
df = df.selectExpr('_1 as year', '_2 as print_page', '_3 as headline')

# Filter out articles without headlines or print_page
df_filtered = df.filter(df['print_page'] != 'NA')
df_filtered = df_filtered.filter(df['headline'] != 'NA')

# Save data to Google Cloud Bucket
df_filtered.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)
