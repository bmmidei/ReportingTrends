import pandas as pd
import numpy as np
import os

full_df = pd.read_csv('LIWC/1851.csv').drop(0).drop(['Source (A)', 'Source (B)', 'Source (C)'], axis=1).mean(axis=0).to_frame().T
full_df['year'] = 1851
for filename in os.listdir('LIWC/'):
    if filename=='1851.csv':
        continue
    else:
        df = pd.read_csv('LIWC/'+filename, encoding='ISO-8859-1').drop(0).drop(['Source (A)', 'Source (B)', 'Source (C)'], axis=1).mean(axis=0).to_frame().T
        df['year'] = int(filename[:-4])
        full_df = full_df.append(df)
        
full_df.sort_values(by='year').set_index('year').reset_index().to_csv('liwc_final.csv')
new_df = df.mean(axis=0).to_frame().T
full_df = new_df
full_df.append(new_df)
full_df.to_csv('aggregated_liwc.csv')