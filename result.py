#!/usr/bin/env python
# coding: utf-8
import codecs
import MySQLdb
import commands
from pyltp import Segmentor
import json
import urllib2
from pyltp import Postagger
#from url_to_story import url_to_story
#from text_to_story import text_to_story
load_path = ''
def text_to_story():
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
	print curr_char[0]
	print type(curr_char[0])
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
    print result
    return result

conn = MySQLdb.connect(
        host = '111.205.121.93',
        #host = 'localhost',
        port = 9002,
        #port = 3306,
        user = 'root',
        passwd = '123456',
        db = 'RelationExtraction',
        charset = 'utf8'
    )
name = "林丹"
cur = conn.cursor()
cur.execute('select * from person_attributOfWilki where person_name = "%s"' %name)
results1 = cur.fetchone()
if results1 is  None:
    print "none"