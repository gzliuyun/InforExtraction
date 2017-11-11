# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from relations.models import Peoplelist,Peoplerelation,Relationlist
from django.http import JsonResponse
import urllib, urllib2
import pynlpir
from pyltp import SentenceSplitter
import os,json
import codecs
from jieba import analyse
from time import strftime, gmtime
# Create your views here.
relWords = [
	# man_and_wife
	"妻子","结婚","婚礼","丈夫","夫人","婚姻","夫妻","相识","老公","举行","夫妇","认识",
	"爱情","工作","感情","相恋","生活","太太","女儿","老婆","太太妻","夫",
	# parent_children
	"父亲","儿子","母亲","女儿","长子","出生","家庭","次子","子女","长女","祖父","世家","次女","三子","原配","去世","生于",
	"父母","夫人","妈妈","爸爸","母子","父女","子","三儿子","四子父","爸","爹","母","妈","娘","儿","女",
	# teacher_and_pupil
	"弟子","先生","师从","老师","学习","艺术","学生","教授","名家","传人","大师","演出","考入","相声","京剧","徒弟",
	"拜师","指导","表演艺术家","师父","师傅","恩师","导师","师","徒",
	# cooperate
	"冠军","演出","世界","合作","组合","决赛","主演","获得","搭档","编剧","沙滩","公开赛","排球","小品","队友",
	"比赛","羽毛球","导演","同事","同僚","女双搭档","小品搭档","男双搭档","沙排搭档","羽毛球混双搭档","羽毛球女双搭档",
	"队友及搭档","双人滑搭档",
	# friends
	"热力","环球","好友","兄弟","静农","电影","影音","加盟","鼓票界","八角","邀请","农君","导演","灌篮","友谊",
	"出版","创作","主演","发表","朋友","挚友","友人","密友友",
	# brother
	"弟弟","哥哥","兄长","兄弟","胞弟","亲兄弟","手足","老二","带入","母弟","关羽","中立","堂兄弟","结盟","同盟会",
	"电影圈","大哥","兄","长兄","三哥","三弟","二哥哥","弟",
	# sweetheart
	"分手","恋情","女友","男友","媒体","绯闻","传出","感情","恋爱","照片","交往","相恋","报道","承认","曝光","朋友",
	"关系","传闻","女星","前女友","前男友","绯闻男友","恋人","男朋友","初恋男友","初恋"
]
def relations_txt(request):
	return render_to_response("relations_txt.html")

def relations_network(request):
	return render_to_response("relations_network.html")

def bt_table(request):
	return render_to_response("bt-table.html")

def cutWords(sentence):
	sendData = {}
	sendData['method'] = "cutWords"
	sendData['sentence'] = sentence

	message = json.dumps(sendData).decode().encode('utf8')
	response = urllib2.urlopen('http://192.168.1.6:10001/',message)
	data = response.read()
	jdata = json.loads(data,encoding="utf8")   #jdata即为获取的json数据
	words = jdata['wordsList']
	
	return words

def postTagger(words):
	sendData = {}
	sendData['method'] = "postTag"
	sendData['wordsList'] = words

	message = json.dumps(sendData).decode().encode('utf8')
	response = urllib2.urlopen('http://192.168.1.6:10001/',message)
	data = response.read()
	jdata = json.loads(data,encoding="utf8")   #jdata即为获取的json数据
	tags = jdata['postags']
	
	return tags

def ner(words,tags):
	sendData = {}
	sendData['method'] = "ner"
	sendData['wordsList'] = words
	sendData['postags'] = tags

	message = json.dumps(sendData).decode().encode('utf8')
	response = urllib2.urlopen('http://192.168.1.6:10001/',message)
	data = response.read()
	jdata = json.loads(data,encoding="utf8")   #jdata即为获取的json数据
	netags = jdata['netags']

	return netags

# 关系抽取，http请求服务求，用训练好的深度学习模型抽取人物关系
def extract_relation(wordsList, name1, name2):
	send = {}
	send["wordsList"] = wordsList
	send["name1"] = name1
	send["name2"] = name2
	message =  json.dumps(send).decode().encode('utf8')
	response = urllib2.urlopen('http://192.168.1.6:10002',message)
	data = response.read()
	jdata =  json.loads(data,encoding="utf8") #jdata即为返回的json数据
	relation = jdata["relation"]

	return relation

def extract_entity(words,tags,netags):
	names = []
	places = []
	orgs = []
	times = []
	# 通过词性标注获取时间词汇
	for k in range(len(words)):
		if tags[k] == 'nt' and words[k] not in times:
			times.append(words[k])
    # 通过命名实体识别获取人名，地名，机构名 
	index = 0
	while index < len(words):
		strEntity = ""
		# 这个词单独构成人名
		if netags[index] == "S-Nh":
			if words[index] not in names:
				names.append(words[index])
		#这个词单独构成地名 
		elif netags[index] == "S-Ni":
			if words[index] not in orgs:
				orgs.append(words[index])
		# 这个词单独构成机构名
		elif netags[index] == "S-Ns":
			if words[index] not in places:
				places.append(words[index])

		# 这个词是人名的开始词汇
		elif netags[index] == "B-Nh":
			strEntity += words[index]
			index += 1
			while netags[index] != "E-Nh":
				strEntity += words[index]
				index += 1
			strEntity += words[index]
			if strEntity not in names:
				names.append(strEntity)
		# 这个词是地名的开始词汇
		elif netags[index] == "B-Ni":
			strEntity += words[index]
			index += 1
			while netags[index] != "E-Ni":
				strEntity += words[index]
				index += 1
			strEntity += words[index]
			if strEntity not in orgs:
				orgs.append(strEntity)
		# 这个词是机构名的开始词汇
		elif netags[index] == "B-Ns":
			strEntity += words[index]
			index += 1
			while netags[index] != "E-Ns":
				strEntity += words[index]
				index += 1
			strEntity += words[index]
			if strEntity not in places:
				places.append(strEntity)

		index += 1
	return names, places, orgs, times

# 关系语句抽取模块bootstrap-table展示部分json写入
def relations_sentence(relSentenceList):
	path = os.path.split(os.path.realpath(__file__))[0] + '/static/json/relSentence.json'
	relTableData = []
	idx = 1
	for item in relSentenceList:
		wordsList = item["wordsList"]
		names = item["names"]
		sentence = "".join(wordsList)
		i = 0
		j = 0
		while (i < len(names)):
			j = i + 1
			while (j < len(names)):
				name1 = names[i]
				name2 = names[j]
				lineItem = {}
				lineItem["idx"] = idx
				idx += 1
				if isinstance(sentence,unicode):
					sentence = sentence.encode('utf8')
				lineItem["sentence"] = sentence
				if isinstance(name1,unicode):
					name1 = name1.encode('utf8')
				lineItem["name1"] = name1
				if isinstance(name2,unicode):
					name2 = name2.encode('utf8')
				lineItem["name2"] = name2
				# 获取深度学习模型抽取的人物关系
				relation = extract_relation(wordsList,name1,name2)
				if isinstance(relation,unicode):
					relation = relation.encode('utf8')
				lineItem["relation"] = relation
				relTableData.append(lineItem)
				j += 1
			i += 1
	return relTableData
	# with codecs.open(path,'w','utf-8') as json_file:
	# 	json_file.write(json.dumps(jsonData,ensure_ascii=False).decode('utf8'))

def relations_txt_submit(request):
	request.encoding='utf-8'
	txtInfo = None
	if request.POST:
		txtInfo = request.POST['input_textarea'].encode('utf8')
	if len(txtInfo.strip()) == 0:
		return 
	txtList = txtInfo.split('\n')
	wordsList = []
	tagsList = []
	
	placeList = []
	nameList = []
	orgList = []
	timeList = []
	#关系语句抽取部分传回数据 
	relSentenceList = []
	# 词频统计
	wordsCount = {}
	for paragraph in txtList:
		sents = SentenceSplitter.split(paragraph)
		for s in sents:
			words = cutWords(s)
			# 词频统计部分
			inRelWords = False
			for word in words:
				if isinstance(word,unicode):
					word = word.encode('utf8')
				if word in wordsCount.keys():
					wordsCount[word] += 1
				else:
					wordsCount[word] = 1

				# 判断句子中是否存在关系关键词
				if inRelWords == False:
					if word in relWords:
						inRelWords = True

			tags = postTagger(words)
			netags = ner(words,tags)
			names, places, orgs, times = extract_entity(words,tags,netags)
			# 添加关系语句抽取部分传回的数据
			if inRelWords and (len(names) >= 2) :   #存在关系关键词 并且两个以上人名，才进行关系抽取。
				sentNames = {}
				sentNames["wordsList"] = words
				sentNames["names"] = names
				relSentenceList.append(sentNames)
			# 添加实体抽取部分传回的数据
			placeList.extend([x for x in places if x not in placeList])
			nameList.extend([x for x in names if x not in nameList])
			orgList.extend([x for x in orgs if x not in orgList])
			timeList.extend([x for x in times if x not in timeList])
			# 添加词性标注部分传回的数据
			wordsList.extend(words)
			# 添加词性说明部分传回的数据
			tagsList.extend(tags)
	# 关系语句抽取模块bootstrap-table展示部分数据写入调用
	relTableData = relations_sentence(relSentenceList)
	# 词频排序
	wordsCount = sorted(wordsCount.items(), key = lambda item: item[1], reverse = True)
	topWordsCount = []
	ct  =  1
	for item in wordsCount:
		if ct <=10 and len(item[0].decode("utf8")) >= 2:
			wc = [item[0],item[1]]
			topWordsCount.append(wc)
			ct += 1
		elif ct > 10:
			break
	#关键词抽取
	keyWords = analyse.textrank(txtInfo,topK=20, withWeight=False)
	for idx in range(len(keyWords)):
		if isinstance(keyWords[idx],unicode):
			keyWords[idx] = keyWords[idx].encode('utf8')

	entityDict = {
		'places': placeList,
		'names': nameList,
		'orgs': orgList,
		'times': timeList
	}		
	return_json = { 
		'text': txtList ,
		'wordsList': wordsList,
		'tagsList': tagsList,
		'topWordsCount': topWordsCount,
		'entityDict': entityDict,
		'relTableData': relTableData,
		'keyWords': keyWords
	}
	# print 'dasdasd',   return_json['keyWords']
	return HttpResponse(json.dumps(return_json),content_type='application/json')


def relations_search(request):
	request.encoding='utf-8'
	name = request.GET.get('search_name',None).encode('utf8')
	pid2name = {}
	pid2url = {}
	rid2name = {} 
	relationInPeople = []
	if name.strip() != "":
		peopleInfo = Peoplelist.objects.filter(name = name).values_list('p_id','name','photo_url')
		
		if len(peopleInfo) == 0:
			return render_to_response("relations_network.html")

		p_id = peopleInfo[0][0]

		if p_id not in pid2name.keys():
			pid2name[p_id] = peopleInfo[0][1]
		if p_id not in pid2url.keys():
			pid2url[p_id] = peopleInfo[0][2]

		relationInfo1 = Peoplerelation.objects.filter(p1_id = p_id).values_list('p1_id','p2_id','r_id')
		relationInPeople.extend(relationInfo1)

		for item in relationInfo1:
			p1_id = item[1]

			peopleInfo = Peoplelist.objects.filter(p_id = p1_id).values_list('p_id','name','photo_url')
			if p1_id not in pid2name.keys():
				pid2name[p1_id] = peopleInfo[0][1]
			if p1_id not in pid2url.keys():
				pid2url[p1_id] = peopleInfo[0][2]

			relationInfo2 = Peoplerelation.objects.filter(p1_id = p1_id).values_list('p1_id','p2_id','r_id')
			relationInPeople.extend(relationInfo2)

			for tp in relationInfo2:
				p2_id = tp[1]
				peopleInfo = Peoplelist.objects.filter(p_id = p2_id).values_list('p_id','name','photo_url')
				if p2_id not in pid2name.keys():
					pid2name[p2_id] = peopleInfo[0][1]
				if p2_id not in pid2url.keys():
					pid2url[p2_id] = peopleInfo[0][2]
		
		for item in relationInPeople:
			relId = item[2]
			relation = Relationlist.objects.filter(r_id = relId).values_list('r_id','r_type')
			if relId not in rid2name.keys():
				rid2name[relId] = relation[0][1]

		path = os.path.split(os.path.realpath(__file__))[0] + '/static/json/relation.json'
		pid2orderid = {}

		jsonData = {}
		jsonData["nodes"] = []
		jsonData["edges"] = []

		index = 0
		for pid in pid2name.keys():
			dt = {}
			dt["name"] = pid2name[pid]
			dt["image"] = pid2url[pid]
			jsonData["nodes"].append(dt)

			pid2orderid[pid] = index 
			index += 1

		for items in relationInPeople:
			dt = {}
			p1_id = items[0]
			p2_id = items[1]
			relId = items[2]
			rType = rid2name[relId]
			dt["source"] = pid2orderid[p1_id]
			dt["target"] = pid2orderid[p2_id]
			dt["relation"] = rType
			jsonData["edges"].append(dt)

		# with codecs.open(path,'w','utf-8') as json_file:
		# 	json_file.write(json.dumps(jsonData,ensure_ascii=False))

	# return render_to_response("relations_network.html")
	return HttpResponse(json.dumps(jsonData),content_type='application/json')
