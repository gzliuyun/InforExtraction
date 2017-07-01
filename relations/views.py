from django.shortcuts import render,render_to_response
from django.http import HttpResponse
# Create your views here.

def relations_txt(request):
	return render_to_response("relations_txt.html")

def relations_network(request):
	return render_to_response("relations_network.html")
