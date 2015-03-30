# import string
# import nltk
# from nltk.tokenize import RegexpTokenizer
# from nltk.corpus import stopwords
# import re
##notes: 1. reduce words to its root form 2. implement if loops if noun is not present
# text=input('Type in your question: ')

#punc. + sep multiple sent. 
def pre_filter(sentence):
	sentence = sentence.lower()
	tokenizer = RegexpTokenizer(r'\w+')
	tokens = tokenizer.tokenize(sentence)
	filtered_words = [w for w in tokens if not w in stopwords.words('english')]
	return " ".join(filtered_words)

def main():
	# Read from standard input
	# Look at Python stdin
	# Play around with using 'sys.stdin' rather than 'input'
	text=input('')
 
	text=pre_filter(text)
	#tagging
	tagged_words = nltk.pos_tag(text.split())
	#finding keywords
	propernouns = [word for word,pos in tagged_words if pos == 'NN']
	print(propernouns)

def test():
	keywords = ["recursion", "PhD", "industry"]
	print(keywords)


# __name__ = tells you which module is importing this file
if __name__ == "__main__":
	# main()
	test()