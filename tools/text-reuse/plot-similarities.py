import csv
import numpy
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook

'''
For the given similarity score CSV (cf. script compute-similarities.py),
this script renders a combined histogram and boxplot figure. 
'''

# Location of the similarity scores CSV
INPUT_FILE = '../../results/near-duplicates/similarities_ngram.csv'

scores = numpy.loadtxt(INPUT_FILE, delimiter=',', skiprows=1, usecols=2)

plt.figure()
plt.subplot(211)
plt.hist(scores, bins=100, rwidth=0.85)

plt.subplot(212)
plt.boxplot(scores, notch=True)
plt.show()
