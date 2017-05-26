from django.shortcuts import render,render_to_response
from django.http import HttpResponse
# Create your views here.

def relations_home(request):
	return render_to_response("relations.html")
