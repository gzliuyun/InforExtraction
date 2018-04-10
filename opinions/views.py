# -*- coding: utf-8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, JsonResponse
import urllib2
import os, json

from jieba import analyse
from pyltp import SentenceSplitter

# Create your views here.
def opinions_txt(request):
	return render_to_response("opinions_txt.html")

def opinions_library(request):
	return render_to_response("opinions_library.html")

def bt_table(request):
	return render_to_response("bt-table.html")

def news(request):
	return render_to_response("news.html")

def h_word_count(words):
	wordsCount = {}
	
	# 统计词频
	for word in words:
		if isinstance(word, unicode):
                        word = word.encode('utf8')
			if word in wordsCount.keys():
				wordsCount[word] += 1
			else:
				wordsCount[word] = 1
	
	# 排序
        wordsCount = sorted(wordsCount.items(), key = lambda item: item[1], reverse = True)
	wordsCount = [item for item in wordsCount if len(item[0].decode("utf8")) >= 2]

	return wordsCount[:10]

def h_url_get( api, data, expectParams ):
        message = json.dumps( data ).decode().encode('utf8')
        response = urllib2.urlopen('http://192.168.1.6:10011/'+api, message)
        data = response.read()
        jdata = json.loads(data, encoding="utf8")   #jdata即为获取的json数据

	if len(expectParams) == 1:
		return jdata[ expectParams[0] ]
	ret = [ jdata[param] for param in expectParams ]
        return tuple(ret)

def h_extract_entity(words, tags):
	# names, places, orgs, times
	triggerTags = ['nh', 'nl', 'ni', 'nt']
	ret = dict( zip(triggerTags, [[] for _ in triggerTags]) )
	
	i = 0
	while i < len(words):
		if tags[i] in triggerTags:
			tmp, _i = '', i
			while tags[i] == tags[_i]  and  i < len(words):
				tmp += words[i]
				i += 1
			ret[ tags[_i] ].append( tmp )
		else:
			i += 1

	return tuple( ret[_] for _ in triggerTags )


def h_basic_analyse( article ):
        wordsList, tagsList = [], []
        # 命名实体
        placeList, nameList, orgList, timeList = [], [], [], []

        # 基础分析
        for paragraph in article.split('\n'):
                sents = SentenceSplitter.split(paragraph)
                for s in sents:
			# 分词和词性标注
                        words, tags = h_url_get( 'basic_analyse', {'text': s}, ['words', 'postags'] )
			wordsList.extend(words)
			tagsList.extend(tags)

                        # 实体抽取
                        names, places, orgs, times = h_extract_entity(words, tags)
                        placeList.extend([x for x in places if x not in placeList])
                        nameList.extend([x for x in names if x not in nameList])
                        orgList.extend([x for x in orgs if x not in orgList])
                        timeList.extend([x for x in times if x not in timeList])
	
	return (wordsList, tagsList, placeList, nameList, orgList, timeList)

def h_opinion_mining( news ):
	return h_url_get( 'opinion_mining', {'text': news}, ['opinions'] )

def opinions_txt_submit(request):
        request.encoding='utf-8'
        txtInfo = None
        if request.POST:
                txtInfo = request.POST['input_textarea'].encode('utf8')
        if len(txtInfo.strip()) == 0:
                return
	
	# 基础分析
        wordsList, tagsList, placeList, nameList, orgList, timeList = h_basic_analyse( txtInfo )
	
	# 观点抽取
	opinionSentenceList = h_opinion_mining( txtInfo )
	relTableData = []
	
	# 词频统计
        topWordsCount = h_word_count( wordsList )
	
        #关键词抽取
        keyWords = analyse.textrank(txtInfo, topK=20, withWeight=False)
        for idx in range(len(keyWords)):
                if isinstance(keyWords[idx], unicode):
                        keyWords[idx] = keyWords[idx].encode('utf8')
		
        ret = {
                'text': txtInfo,
                'wordsList': wordsList,
                'tagsList': tagsList,
                'topWordsCount': topWordsCount,
                'entityDict': {
			'places': placeList,
	                'names': nameList,
	                'orgs': orgList,
	                'times': timeList
		},
                'relTableData': relTableData,
                'keyWords': keyWords,
		'opinions': opinionSentenceList
        }
	
	return HttpResponse(json.dumps(ret),content_type='application/json')

def opinions_search(request):
	request.encoding='utf-8'
	name, keyword = None, None
		
	if request.POST:
		name = request.POST['name'].encode('utf8')
		keyword = request.POST['keyword'].encode('utf8')
		page = request.POST['page']
	if len(name.strip()) == 0  and  len(keyword.strip()) == 0:
		return
	
	ret = h_url_get( 'opinion_search', {'name': name, 'keyword': keyword, 'page': page}, ['opinions'] )
	return HttpResponse(json.dumps(ret),content_type='application/json')
