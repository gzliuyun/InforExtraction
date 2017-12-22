from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^txt/$', views.attributes_home),
	url(r'^txt/submit/$',views.text_upload),
	url(r'^network/$',views.attributes_network),
]