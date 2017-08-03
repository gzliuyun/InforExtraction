from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^txt/$', views.relations_txt),
	url(r'^network/$',views.relations_network),
	url(r'^search/$',views.relations_search),
	url(r'^txt/submit/$',views.relations_txt_submit),
]