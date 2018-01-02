#!/usr/bin/env python
# coding: utf-8
import codecs
import commands
from pyltp import Segmentor
import json
import urllib2
from pyltp import Postagger
#from url_to_story import url_to_story
#from text_to_story import text_to_story
load_path = ''
def segmentor(sentence):
    sendData = {}
    sendData['method'] = "cutWords"
    sendData['sentence'] = sentence

    message = json.dumps(sendData).decode().encode('utf8')
    response = urllib2.urlopen('http://192.168.1.6:10001/', message)
    data = response.read()
    jdata = json.loads(data, encoding="utf8")  # jdata即为获取的json数据
    words = jdata['wordsList']

    #########for test######
    #words = ["测试"]
    print words
    return words

def postagger(words):
    sendData = {}
    sendData['method'] = "postTag"
    sendData['wordsList'] = words

    message = json.dumps(sendData).decode().encode('utf8')
    response = urllib2.urlopen('http://192.168.1.6:10001/', message)
    data = response.read()
    jdata = json.loads(data, encoding="utf8")  # jdata即为获取的json数据
    postags = jdata['postags']
    ######### for test
    #postags = ['nh']
    print postags
    file = codecs.open('/home/pengbin/attribute_extraction/bishe/test.data','w','utf-8')
    result = []
    for word,tag in zip(words,postags):
        pair = []
        pair.append(word)
        pair.append(tag)
        result.append(pair)

    for pa in result:
        for x in pa[0]:
            file.write(x + "\t")
            #file.write(x + "\t")
            file.write(pa[1] + "\n")
    file.close()

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
def text_to_story(text):
    print "#######" + text.encode('utf-8').decode('utf-8')
    postagger(segmentor(text))
    ##执行shell命令，开始跑模型，
    commands.getstatusoutput('cd /home/pengbin/attribute_extraction/bishe/ && ./crf_test -m 6.model test.data > test.rst ')
    ##执行结束，结果存在了test.rst里面
    file = open('/home/pengbin/attribute_extraction/bishe/test.rst','r')
    result = {
        'name':[],
        'university':[],
        'major':[],
        'education':[],
        'school':[],
        'party':[],
        'birthday':[],
        'jointime':[],
        'job':[],
        'birthplace':[],
        'workplace':[],
        'nation':[],
        'gender':[]
    }

    tmp_str = ""
    for line in file.readlines():
        line_list = line.split('\t')
        curr_char = line_list[len(line_list) - 1]
        if curr_char[0] == 'N':
            continue
        ##name属性
        elif 'name' in curr_char:
            if curr_char[0] == 'S':
                result['name'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['name'].append(tmp_str)
                tmp_str = ""
        ##university属性
        elif 'university' in curr_char:
            if curr_char[0] == 'S':
                result['university'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['university'].append(tmp_str)
                tmp_str = ""
        ##major属性
        elif 'major' in curr_char:
            if curr_char[0] == 'S':
                result['major'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['major'].append(tmp_str)
                tmp_str = ""
        ##education属性
        elif 'education' in curr_char:
            if curr_char[0] == 'S':
                result['education'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['education'].append(tmp_str)
                tmp_str = ""
        ##school属性
        elif 'school' in curr_char:
            if curr_char[0] == 'S':
                result['school'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['school'].append(tmp_str)
                tmp_str = ""
        ##party属性
        elif 'party' in curr_char:
            if curr_char[0] == 'S':
                result['party'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['party'].append(tmp_str)
                tmp_str = ""
        ##birthday属性
        elif 'birthday' in curr_char:
            if curr_char[0] == 'S':
                result['birthday'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['birthday'].append(tmp_str)
                tmp_str = ""
        ##jointime属性
        elif 'jointime' in curr_char:
            if curr_char[0] == 'S':
                result['jointime'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['jointime'].append(tmp_str)
                tmp_str = ""
        ##job属性
        elif 'job' in curr_char:
            if curr_char[0] == 'S':
                result['job'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['job'].append(tmp_str)
                tmp_str = ""
        ##birthplace属性
        elif 'birthplace' in curr_char:
            if curr_char[0] == 'S':
                result['birthplace'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['birthplace'].append(tmp_str)
                tmp_str = ""
        ##workplace属性
        elif 'workplace' in curr_char:
            if curr_char[0] == 'S':
                result['workplace'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['workplace'].append(tmp_str)
                tmp_str = ""
        ##nation属性
        elif 'nation' in curr_char:
            if curr_char[0] == 'S':
                result['nation'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['nation'].append(tmp_str)
                tmp_str = ""
        ##gender属性
        elif 'gender' in curr_char:
            if curr_char[0] == 'S':
                result['gender'].append(line_list[0])
            elif curr_char[0] == 'B':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'M':
                tmp_str += line_list[0]
                continue
            elif curr_char[0] == 'E':
                tmp_str += line_list[0]
                result['gender'].append(tmp_str)
                tmp_str = ""
    file.close()
    for key in result:
        result[key] = list(set(result[key]))
    print result
    return result
# class RequestHandler(pyjsonrpc.HttpRequestHandler):
#     @pyjsonrpc.rpcmethod
#     # def from_url(self, url):
#     #     """Test method"""
#     #     res = url_to_story(url)
#     #     return res
#
#     @pyjsonrpc.rpcmethod
#     def from_text(self, text):
#         """Test method"""
#         res = text_to_story(text)
#         return res
#
# # Threading HTTP-Server
# http_server = pyjsonrpc.ThreadingHttpServer(
#     server_address = ('127.0.0.1', 13813),
#     RequestHandlerClass = RequestHandler
# )
# print "Starting HTTP server ..."
# print "URL: http://localhost:13813"
# http_server.serve_forever()