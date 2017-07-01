from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^txt/$', views.relations_txt),
	url(r'^network/$',views.relations_network),
]