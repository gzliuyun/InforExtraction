# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from relations.models import Peoplelist,Peoplerelation,Relationlist
import os,json
import codecs
# Create your views here.

def relations_txt(request):
	return render_to_response("relations_txt.html")

def relations_network(request):
	return render_to_response("relations_network.html")

def relations_search(request):
	request.encoding='utf-8'
	name = request.GET.get('search_name', None).encode('utf8')
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

		with codecs.open(path,'w','utf-8') as json_file:
			json_file.write(json.dumps(jsonData,ensure_ascii=False))

	return render_to_response("relations_network.html")
