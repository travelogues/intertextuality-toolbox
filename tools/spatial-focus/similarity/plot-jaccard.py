import csv
import numpy
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook

import sys
sys.path.append('..')
import config as cfg

'''
For the given spatial jaccard similarity score CSV, this script renders a
combined histogram and boxplot figure. The CSV row format is as follows:

{barcode_a}, {barcode_b}, {jaccard_variant}, {jaccard_resolved}

'''

scores = numpy.loadtxt(cfg.SIMILARITY_RESULT_FILE, delimiter=',', skiprows=0, usecols=(2,3))

plt.figure()
plt.subplot(211)
plt.hist(scores, bins=100, rwidth=0.85)

plt.subplot(212)
plt.boxplot(scores, notch=True)
plt.show()
