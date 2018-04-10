#coding=utf-8
from pyltp import Segmentor
from pyltp import Postagger
def segmentor(sentence='赵黎平1951年8月生，河北玉田人，在职研究生学历,1976年9月入党，1969年4月参加工作。曾任内蒙古自治区人民政府副主席，自治区公安厅党委书记、厅长，内蒙古自治区政协副主席等职务。赵黎平从2005年开始担任内蒙古自治区公安厅厅长，直到2012年7月被免去公安厅厅长职务，赵黎平主政内蒙古系统长达7年之久'):
	segmentor = Segmentor()
	segmentor.load('/home/pengbin/下载/ltp_data_v3.4.0/cws.model')
	words = segmentor.segment(sentence)
	words_list = list(words)
	segmentor.release()
	return words_list

def posttagger(words = segmentor()):
	postagger = Postagger()
	postagger.load('/home/pengbin/下载/ltp_data_v3.4.0/pos.model')
	postags = postagger.postag(words)
	for word,tag in zip(words,postags):
			#print word + '	' + tag
			#print type(word)
			#print word[0]
			for x in range(len(word)):
					print word[x] + '	' + tag
	#print type(postags)
	#for tag in postags:
			print tag
	postagger.release()

posttagger()
	
