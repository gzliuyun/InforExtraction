# coding: utf-8
import json
import urllib2
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.http import JsonResponse
from attribute_extr_client import extr_from_text,extr_from_url
from web_rpc_server import text_to_story,ner,extract_entity,segmentor
from pyltp import SentenceSplitter
from bs4 import BeautifulSoup
from jieba import analyse
# Create your views here.

def attributes_home(request):
	return render_to_response("attributes.html")

def attributes_network(request):
	return render_to_response("attributes_network.html")


def postTagger(words):
    sendData = {}
    sendData['method'] = "postTag"
    sendData['wordsList'] = words

    message = json.dumps(sendData).decode().encode('utf8')
    response = urllib2.urlopen('http://192.168.1.6:10001/', message)
    data = response.read()
    jdata = json.loads(data, encoding="utf8")  # jdata即为获取的json数据
    tags = jdata['postags']

    return tags
def text_upload(request):
    request.encoding = 'utf-8'
    text = request.GET.get('input_textarea', None).encode('utf8')
    print "peng###############bin"
    print text
    print type(text)
    if len(text.strip()) == 0:
        return
    txtList = text.split('\n')
    result = {}
    result = text_to_story(text)
    wordsList = []
    tagsList = []

    placeList = []
    nameList = []
    orgList = []
    timeList = []
    # 词频统计
    wordsCount = {}
    for paragraph in txtList:
        sents = SentenceSplitter.split(paragraph)
        for s in sents:
            words = segmentor(s)
            # 词频统计部分
            inRelWords = False
            for word in words:
                if isinstance(word, unicode):
                    word = word.encode('utf-8')
                if word in wordsCount.keys():
                    wordsCount[word] += 1
                else:
                    wordsCount[word] = 1
            tags = postTagger(words)
            netags = ner(words, tags)
            names, places, orgs, times = extract_entity(words, tags, netags)
            # 添加实体抽取部分传回的数据
            placeList.extend([x for x in places if x not in placeList])
            nameList.extend([x for x in names if x not in nameList])
            orgList.extend([x for x in orgs if x not in orgList])
            timeList.extend([x for x in times if x not in timeList])
            # 添加词性标注部分传回的数据
            wordsList.extend(words)
            # 添加词性说明部分传回的数据
            tagsList.extend(tags)
    # 词频排序
    wordsCount = sorted(wordsCount.items(), key=lambda item: item[1], reverse=True)
    topWordsCount = []
    ct = 1
    for item in wordsCount:
        if ct <= 10 and len(item[0]) > 1:
            wc = [item[0], item[1]]
            topWordsCount.append(wc)
            ct += 1
        elif ct > 10:
            break
    # 关键词抽取
    # keyWords = analyse.textrank(text, topK=20, withWeight=False)
    # for idx in range(len(keyWords)):
    #     if isinstance(keyWords[idx], unicode):
    #         keyWords[idx] = keyWords[idx].encode('utf-8')

    entityDict = {
        'places': placeList,
        'names': nameList,
        'orgs': orgList,
        'times': timeList
    }

    return_json = {
        'text':txtList,
        'attributeDict': result,
        'wordsList': wordsList,
        'tagsList': tagsList,
        'topWordsCount': topWordsCount,
        'entityDict': entityDict
    }
    return HttpResponse(json.dumps(return_json),content_type='application/json')

def people_search(request):
    request.encoding = 'utf-8'
    name = request.GET.get('search_name', None).encode('utf8')
    print name
    print "--------"
    url = "https://zh.wikipedia.org/wiki/" + str(name)
    print url
    response = urllib2.urlopen(url)
    bs = BeautifulSoup(response.read(), "html.parser")
    table = bs.find('table', attrs={'class': 'infobox'})
    print table
    return HttpResponse(json.dumps(table), content_type='application/json')