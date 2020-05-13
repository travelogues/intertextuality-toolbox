from gensim.test.utils import common_texts
from gensim.corpora.dictionary import Dictionary
from gensim.models import LdaModel

print(common_texts)

# Create a corpus from a list of texts
common_dictionary = Dictionary(common_texts)
common_corpus = [common_dictionary.doc2bow(text) for text in common_texts]

# Train the model on the corpus.
# lda = LdaModel(common_corpus, num_topics=20)
lda = LdaModel(common_corpus, num_topics=3, id2word=common_dictionary)
lda.save('model.foo.gensim')

for i in range(0, lda.num_topics - 1):
    print(lda.print_topic(i))
