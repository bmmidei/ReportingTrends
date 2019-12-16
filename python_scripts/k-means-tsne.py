import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from scipy.spatial.distance import cdist
import matplotlib.pyplot as plt
from sklearn import preprocessing
from sklearn.manifold import TSNE
from matplotlib.pyplot import figure

df = pd.read_csv('econ-data.csv', usecols=['year','change-current','change-chained','Inflation','employed_percent','unemployed_percent'])
#df = pd.read_csv('liwc_final2.csv')

data = df[['change-current','change-chained','Inflation','unemployed_percent']]
#data = df[['Affect Words', 'Positive emotion', 'Negative emotion','Anxiety', 'Anger', 'Sadness']]

x = data.values
min_max_scaler = preprocessing.MinMaxScaler()
x_scaled = min_max_scaler.fit_transform(x)
new_df = pd.DataFrame(x_scaled)
X = new_df.to_numpy()
kmeans = KMeans(n_clusters=5).fit(x_scaled)


X_embedded = TSNE(n_components=2).fit_transform(X)
coords = pd.DataFrame(X_embedded)
coords['year'] = df['year'].to_numpy()
coords['cluster'] = kmeans.labels_
coords = coords.rename(columns={0: "x", 1: "y"})


figure(num=None, figsize=(15, 15), dpi=80, facecolor='w', edgecolor='k')
plt.scatter(X_embedded[:, 0], X_embedded[:, 1], c=kmeans.labels_, s=117, cmap='viridis')

centers = kmeans.cluster_centers_
for i, txt in enumerate(df['year'].to_numpy()):
    plt.annotate(txt, (X_embedded[:, 0][i], X_embedded[:, 1][i]))
    
coords['year'] = df['year'].to_numpy()
final_df = df.merge(coords, on='year')
final_df.to_csv('tsne_with_economic.csv', index=False)
#final_df.to_csv('tsne_with_liwc.csv', index=False)