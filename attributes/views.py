
import json
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.http import JsonResponse
from attribute_extr_client import extr_from_text,extr_from_url
from web_rpc_server import text_to_story
# Create your views here.

def attributes_home(request):
	return render_to_response("attributes.html")

def attributes_network(request):
	return render_to_response("attributes_network.html")
def text_upload(request):
    #request.encoding = 'utf-8'
    text = request.GET.get('input_textarea', None)
    print "peng###############bin"
    print text
    print type(text)
    if len(text.strip()) == 0:
        return
    txtList = text.split('\n')
    result = {}
    result = text_to_story(text)
    return_json = {
        'text':txtList,
        'attributeDict': result
    }
    return HttpResponse(json.dumps(return_json),content_type='application/json')

# def index(request):
#     testlo = {'a': 1, 'b': 2}
#
#     if request.method == 'GET':
#         return render(request, 'attributes.html')
#
#     elif request.method == 'POST' and request.POST:
#         data_form = request.POST
#         # print data_form
#         if 'text' in data_form:
#             text = data_form['text']
#             parsed_dic = extr_from_text(text)
#             #print parsed_dic
#             return JsonResponse(parsed_dic)
#         elif 'url' in data_form:
#             text = data_form['url']
#             parsed_dic = extr_from_url(text)
#             #print parsed_dic
#             return JsonResponse(parsed_dic)
#         # print data_form
#         # res = {}
#         # print("event_view=" + event_view)
#         #
#         # if event_view == 'event_geo_net':