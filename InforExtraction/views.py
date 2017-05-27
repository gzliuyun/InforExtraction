from django.shortcuts import render,render_to_response
from django.http import HttpResponse
# Create your views here.

def home(request):
	# return HttpResponse("Hello,word. you're at the relation index.")
	return render_to_response('home.html')

def login(request):
	# return HttpResponse("Hello,word. you're at the relation index.")
	return render_to_response('login.html')