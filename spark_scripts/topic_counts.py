from pyspark import SparkConf, SparkContext
import json
from datetime import datetime

SAVE_DIR = 'topics'
GCP_BUCKET = 'gs://big_data_econ'
sc = SparkContext.getOrCreate()

# Read in all json files into an RDD
# Use 'wholeTextFiles' to prevent fragmenting of json objects
months = sc.wholeTextFiles(GCP_BUCKET + '/articles/*.json')

# Jsonnify each text string into a dictionary
months = months.map(lambda x: json.loads(x[1]))
articles = months.flatMap(lambda x: x)

def get_year_topics(article):
    time = datetime.strptime(article['pub_date'].split('T')[0], '%Y-%m-%d')
    year = time.year
    economic_keywords = set(['currency', 'taxation', 'finances', 'stocks and bonds',
                             'credit', 'commerce', 'economy', 'banks and banking',
                             'budget', 'unemployment', 'economic conditions',
                             'economic conditions and policy', 'bankruptcies',
                             'economic conditions and policies', 'economy and finances',
                             'economic conditions and trends',
                             'budgets and budgeting', 'banking and financial institutions'])
    political_keywords = set(['politics and government', 'congress', 'senate', 'legislature',
                              'democratic party', 'republican party', 'elections'])
    topics = []
    if 'keywords' in article and article['keywords']:
        if any([word['value'].lower() in economic_keywords for word in article['keywords']]):
            topics.append((year, 'economic_topic'))
        if any([word['value'].lower() in political_keywords for word in article['keywords']]):
            topics.append((year, 'political_topic'))
    return topics


# Map articles to (year, topic) format
topics = articles.flatMap(lambda article: get_year_topics(article))

# Aggregate topic counts by year
year_topics = topics.map(lambda x: (x, 1)).reduceByKey(lambda x, y: x + y)

# Write to dataframe
df = year_topics.map(lambda x: (x[0][0], x[0][1], x[1])).toDF()
df = df.selectExpr('_1 as year', '_2 as topic', '_3 as count')

# Save data to Google Cloud Bucket
df_ordered.coalesce(1).write.format('csv').save('gs://big_data_econ/csvs/' + SAVE_DIR)