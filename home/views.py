# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.http import JsonResponse
import pymysql
import  json
import datetime
import re

# Create your views here.
def home_txt(request):
	return render_to_response("home_txt.html")


def get_db_connection(name):
	return pymysql.connect("localhost", "root", "123456", name, charset="utf8mb4" )


def group(n, sep = ','):
    s = str(abs(n))[::-1]
    groups = []
    i = 0
    while i < len(s):
        groups.append(s[i:i+3])
        i+=3
    retval = sep.join(groups)[::-1]
    if n < 0:
        return '-%s' % retval
    else:
        return retval

# global
submittimestap = datetime.datetime.now()
submitupdateSeconds = 3600


submitRetHistory = {}
def home_txt_submit(request):
	global submittimestap, submitupdateSeconds, submitRetHistory
	time = datetime.datetime.now()

	if not submitRetHistory or (time - submittimestap).seconds >= submitupdateSeconds:
		dbconn = get_db_connection('RelationExtraction')
		cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)
		sql = 'SELECT count(1) as `num` from `Peoplelist`'
		cursor.execute( sql )
		tmp = cursor.fetchone()
		people_num = 0
		if len(tmp)>= 1:
			people_num = tmp['num']

		sql = 'SELECT count(1) as `num` from `Peoplerelation`'
		cursor.execute(sql)
		tmp = cursor.fetchone()
		relation_num = 0
		if len(tmp)>= 1:
			relation_num = tmp['num']

		sql = 'SELECT count(1) as `num` from `Relationlist`'
		cursor.execute(sql)
		tmp = cursor.fetchone()
		relation_type_num = 0
		if len(tmp)>= 1:
			relation_type_num = tmp['num']


		sql = 'SELECT `age`, count(`age`) as `num` from ( \
  			select floor(convert(SUBSTR(`birthday` FROM 1 FOR 4), SIGNED)/10) as `age` from `person_attributOfWilki`) `t` group by `age` '
  		cursor.execute(sql)
  		tmp = cursor.fetchall()

  		ages_list = [0 for i in range(20)]

  		for row in tmp:
  			if row['age'] < 180:
  				continue
  			else:
  				ages_list[row['age']-181] = row['num']


  		sql = 'select `p`.`r_id`, count(`p`.`r_id`) as `num` , `l`.`r_type` as `type` from `Peoplerelation` `p`, `Relationlist` `l` where `p`.`r_id` = `l`.`r_id` \
				group by `p`.`r_id` order by `num` desc limit 0, 6'
		cursor.execute(sql)
		tmp = cursor.fetchall()

		relation_list = []
		relation_list_title = []
		relationSum = 0
		for row in tmp:
			relation_dict = {}
			relation_dict["value"] = row['num']
			relation_dict['name'] = row['type']
			relation_list_title.append(row['type'])
			relationSum = relationSum + row['num']
			relation_list.append(relation_dict)

	
		relation_list_per = round((relationSum*1.0) / relation_num,2)


		cursor.close()
		dbconn.close()

		dbconn = get_db_connection('opinion')
		cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)
		sql = 'SELECT count(1) as `num` from `news`'
		cursor.execute( sql )
		tmp = cursor.fetchone()
		news_num = 0
		if len(tmp)>= 1:
			news_num = tmp['num']

		sql = 'SELECT count(1) as `num` from `opinions`'
		cursor.execute( sql )
		tmp = cursor.fetchone()
		opinions_num = 0
		if len(tmp)>= 1:
			opinions_num = tmp['num']


		cursor.close()
		dbconn.close()


		ret = {'peopleNum':group(people_num), 
			'relationNum':group(relation_num),
			'relationTypeNum':group(relation_type_num),
			'newsNum':group(news_num),
			'opinionsNum':group(opinions_num),
			'ages19List':ages_list[0:10],
			'ages20List':ages_list[10:20],
			'relationList':relation_list,
			'relationListTitle':relation_list_title,
			'relationListPer':relation_list_per,
		}
		submitRetHistory = ret
	
	if ( time - submittimestap).seconds >= submitupdateSeconds:
		submittimestap = time + datetime.timedelta(seconds=submitupdateSeconds) 

	return HttpResponse(json.dumps(submitRetHistory), content_type='application/json')


sourcetimestap = datetime.datetime.now()
sourceupdateSeconds = 3600

sourceRetHistory = {}
def home_txt_source(request):
	global sourcetimestap, sourceupdateSeconds, sourceRetHistory
	time = datetime.datetime.now()
	if not sourceRetHistory or (time - sourcetimestap).seconds >= sourceupdateSeconds:
		dbconn = get_db_connection('opinion')
		cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)
	

		sql = 'select `source` as `type`, count(`source`) as `num` from `news` group by `source` \
			order by `num` desc limit 0,6'
		cursor.execute(sql)
		tmp = cursor.fetchall()

		source_list = []
		source_list_title = []
		#sourceSum = 0
		for row in tmp:
			source_dict = {}
			source_dict["value"] = row['num']
			source_dict['name'] = row['type']
			source_list_title.append(row['type'])
			#sourceSum = sourceSum + row['num']
			source_list.append(source_dict)


		cursor.close()
		dbconn.close()


		ret = {'sourceList': source_list,
				'sourceListTitle': source_list_title}
		sourceRetHistory = ret

	if ( time - sourcetimestap).seconds >= sourceupdateSeconds:
		sourcetimestap = time + datetime.timedelta(seconds=sourceupdateSeconds) 

	return HttpResponse(json.dumps(sourceRetHistory), content_type='application/json')


classifytimestap = datetime.datetime.now()
classifyupdateSeconds = 3600
classifyRetHistory = {}
def home_txt_classify(request):
	global classifytimestap, classifyupdateSeconds, classifyRetHistory
	time = datetime.datetime.now()
	if not classifyRetHistory or (time - classifytimestap).seconds >= classifyupdateSeconds:
		dbconn = get_db_connection('opinion')
		cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)

		sql = 'select `classify`, count(`classify`) as `num` from `news` group by `classify` \
				order by `num` desc limit 1, 7'
		cursor.execute(sql)
		tmp = cursor.fetchall()
		classify_list_title = []
		classify_list = []
	
		for row in tmp:
		#classify_list_title.append(row['classify'])
			classify_list_title.append(row['classify'])
			classify_list.append(row['num']/1000)


		cursor.close()
		dbconn.close()


		ret = {'classifyListTitle': classify_list_title,
				'classifyList': classify_list}
		classifyRetHistory = ret

	if ( time - classifytimestap).seconds >= classifyupdateSeconds:
		classifytimestap = time + datetime.timedelta(seconds=classifyupdateSeconds) 

	return HttpResponse(json.dumps(classifyRetHistory), content_type='application/json')


opinionstimestap = datetime.datetime.now()
opinionsupdateSeconds = 3600
opinionsRetHistory = {}
def home_txt_opinions(request):
	global opinionstimestap, opinionsupdateSeconds, opinionsRetHistory
	time = datetime.datetime.now()
	if not opinionsRetHistory or (time - opinionstimestap).seconds >= opinionsupdateSeconds:
		dbconn = get_db_connection('opinion')
		cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)

		sql = 'select  `people`.`name` as `type`, `t`.`holder_id`, `t`.`num` as `ght`, `people`.`hotwords` as `hotwords`from (\
			select `holder_id`, count(`holder_id`) as `num` from `opinions` \
			GROUP BY `holder_id` \
			order by `num` desc) `t`, `people` \
			where  `people`.`id` = `t`.`holder_id` limit 1,7'
		cursor.execute(sql)
		tmp = cursor.fetchall()
		opinions_list_title = []
		opinions_list = []


		opinions_table = []
		ids = 1
		for row in tmp:
		#classify_list_title.append(row['classify'])
			opinions_dict = {}
			opinions_dict["value"] = row['ght']
			opinions_dict['name'] = row['type']
			opinions_list_title.append(row['type'])
			#sourceSum = sourceSum + row['num']
			opinions_list.append(opinions_dict)

			opinions_table_dict = {}
			opinions_table_dict["ids"] = ids
			ids = ids + 1
			opinions_table_dict['name'] = row['type']
			opinions_table_dict['number'] = row['ght']

			hotwords = re.sub('\d|\[|\]|-','',row['hotwords'])
			hotwords = hotwords.replace(', , ',',')

			hotwordg = hotwords.split(',')

			hotwordsStr = ""
			number = 1
			for word in hotwordg:
				if number > 10:
					break
				hotwordsStr = hotwordsStr + word + ','
				number = number + 1

			opinions_table_dict['hotwords']  = hotwordsStr
			opinions_table.append(opinions_table_dict)


		cursor.close()
		dbconn.close()


		ret = {'opinionsListTitle': opinions_list_title,
				'opinionsList': opinions_list,
				'opinionsTable': opinions_table}
		opinionsRetHistory = ret

	if ( time - opinionstimestap).seconds >= opinionsupdateSeconds:
		opinionstimestap = time + datetime.timedelta(seconds=opinionsupdateSeconds) 


	return HttpResponse(json.dumps(opinionsRetHistory), content_type='application/json')




