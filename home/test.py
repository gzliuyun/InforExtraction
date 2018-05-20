# -*- coding: utf-8 -*-
import pymysql




def get_db_connection(name):
	return pymysql.connect("localhost", "root", "123456", name, charset="utf8mb4" )


def home_txt_submit():
	dbconn = get_db_connection('RelationExtraction')
	cursor = dbconn.cursor(cursor=pymysql.cursors.DictCursor)
	sql = 'SELECT count(1) as `num` from `Peoplelist`'
	cursor.execute( sql )
	tmp = cursor.fetchone()

	print(tmp)
	people_num = 0
	if len(tmp)>= 1:
		people_num = tmp['num']
	
	ret = {
			"people_num":200,
	}

	print(ret['people_num'])

	print(people_num)

	cursor.close()
	dbconn.close()

	

home_txt_submit()
