# -*- coding: utf-8 -*-
from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.http import JsonResponse

# Create your views here.
def home_txt(request):
	return render_to_response("home_txt.html")

