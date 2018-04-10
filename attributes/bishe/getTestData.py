#!/usr/bin/env python
# coding=utf-8
from pyltp import Segmentor
from pyltp import Postagger
#import urllib
import sys
import codecs
reload(sys)
sys.setdefaultencoding('utf-8')
def getStr(filename):
    fie = open(filename)
    str_result = fie.read()
    #return str_result
    #print str_result
    #print type(str_result)
    return str_result

def segmentor(sentence):
	segmentor = Segmentor()
	segmentor.load('/home/pengbin/下载/ltp_data_v3.4.0/cws.model')
	words = segmentor.segment(sentence)
	words_list = list(words)
	segmentor.release()
	return words_list

def posttagger(words):
	postagger = Postagger()
	postagger.load('/home/pengbin/下载/ltp_data_v3.4.0/pos.model')
	postags = postagger.postag(words)
	file = codecs.open('test.data','w','utf-8')
	result = []
	for word,tag in zip(words,postags):
			pair = []
			pair.append(word)
			pair.append(tag)
			result.append(pair)
			print word + '	' + tag
	for pa in result:
			for x in pa[0].decode('utf-8'):
					#print type(x)
					#print x.decode('utf-8').encode('utf-8') + '\t' + pa[1]
					file.write(x.encode('utf-8') + "\t")
					file.write(pa[1] + "\n")
	file.close()
	postagger.release()
#def getWordFile(text):
#    file = open('test.data','w')
#    #print content
#    i = 1
#    for word in content:
#        #print word
#        word_list = word.split('_')
#        #print word_list[0]
#        #print word_list[1]
#        for alone_word in word_list[0].decode('utf-8'):
#            file.write(alone_word.encode('utf-8') + "\t")
#            file.write(word_list[1] + "\n")
#    file.close()
    
#getWordFile("训练文件由若干个句子组成")
lis = segmentor(getStr('/home/pengbin/bishe/news'))
posttagger(lis)
