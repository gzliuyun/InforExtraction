from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^txt/$', views.home_txt),
	url(r'^txt/submit/$', views.home_txt_submit),
	url(r'^txt/source/$', views.home_txt_source),
	url(r'^txt/classify/$', views.home_txt_classify),
	url(r'^txt/opinions/$', views.home_txt_opinions),
]
