from django.shortcuts import render,render_to_response
from django.http import HttpResponse
# Create your views here.

def index(request):
	return HttpResponse("Hello,word. you're at the relation index.")
