# coding: utf-8
import json
import MySQLdb
import urllib2
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.http import JsonResponse
from attribute_extr_client import extr_from_text,extr_from_url
from web_rpc_server import text_to_story,ner,extract_entity,segmentor
from pyltp import SentenceSplitter
from collections import OrderedDict
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
    text = None
    if request.POST:
        text = request.POST['input_textarea'].encode('utf8')
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
    print "test wordsCount"
    print wordsCount
    topWordsCount = []
    ct = 1
    for item in wordsCount:
        if ct <= 10 and len(item[0].decode('utf-8')) > 1:
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
    print "after filter"
    print topWordsCount
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
    #name = request.GET.get('search_name', None).encode('utf8')
    name = request.GET.get('search_name', None).encode('utf8')
    print name
    print "--------"

    conn = MySQLdb.connect(
        #host = '111.205.121.93',
        host = 'localhost',
        #port = 9002,
        port = 3306,
        user = 'root',
        passwd = '123456',
        db = 'RelationExtraction',
        charset = 'utf8'
    )
    print type(name)
    cur = conn.cursor()

    cur.execute('select * from person_attributOfWilki where person_name = "%s"' %name)
    ###results1是一个元祖tuple
    results1 = cur.fetchone()
    results_attributes = OrderedDict()
    print "#########"
    #print type(results1[1])  ###unicode字符
    ###有序字典
    hasattribute = 0
    if results1 is None:
        hasattribute = 0
    else:
        if results1[1] is not None:
            results_attributes['姓名'] = results1[1].encode('utf8')
        if results1[2] is not None:
            results_attributes['大学学校'] = results1[2].encode('utf8')
        if results1[3] is not None:
            results_attributes['专业'] = results1[3].encode('utf8')
        if results1[4] is not None:
            results_attributes['学历'] = results1[4].encode('utf8')
        if results1[5] is not None:
            results_attributes['中学学校'] = results1[5].encode('utf8')
        if results1[6] is not None:
            results_attributes['政党'] = results1[6].encode('utf8')
        if results1[7] is not None:
            results_attributes['出生年月'] = results1[7].encode('utf8')
        if results1[8] is not None:
            results_attributes['入党时间'] = results1[8].encode('utf8')
        if results1[9] is not None:
            results_attributes['职业'] = results1[9].encode('utf8')
        if results1[10] is not None:
            results_attributes['出生地'] = results1[10].encode('utf8')
        if results1[11] is not None:
            results_attributes['工作地点'] = results1[11].encode('utf8')
        if results1[12] is not None:
            results_attributes['民族'] = results1[12].encode('utf8')
        if results1[13] is not None:
            results_attributes['性别'] = results1[13].encode('utf8')
        if results1[14] is not None:
            results_attributes['配偶'] = results1[14].encode('utf8')
        if results1[15] is not None:
            results_attributes['儿女'] = results1[15].encode('utf8')
        if results1[16] is not None:
            results_attributes['父母'] = results1[16].encode('utf8')

    cur.execute('select * from Peoplelist where name = "%s"' %name)
    results2 = cur.fetchone()
    results_info = OrderedDict()
    hasinfo = 0
    if results2 is None:
        hasinfo = 0
    ####有序字典
    else:
        if results2[1] is not None:
            results_info['姓名'] = results2[1].encode('utf8')
        if results2[2] is not None:
            results_info['简介'] = results2[2].encode('utf8')
        if results2[3] is not None:
            results_info['url'] = results2[3].encode('utf8')
        if results2[4] is not None:
            results_info['photo_url'] = results2[4].encode('utf8')

    conn.close()
    results_json = {
        'attributes':results_attributes,
        'information':results_info
    }
    return HttpResponse(json.dumps(results_json), content_type='application/json')
    ####直接获取百度或者维基百科页面信息
    # url_wiki = "https://zh.wikipedia.org/wiki/" + str(name)
    # url_baidu = "https://baike.baidu.com/item/" + str(name)
    # print url_baidu
    # response = urllib2.urlopen(url_baidu)
    # bs = BeautifulSoup(response.read(), "html.parser")
    # table_wiki = bs.find('table', attrs={'class': 'infobox'})
    # table_baidu = bs.find('div', attrs={'class': 'basic-info'})
    # print table_baidu
    # #return HttpResponse(json.dumps(table_wiki), content_type='application/json')
    # return HttpResponse(table_baidu, content_type='text/html')
