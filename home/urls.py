from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^txt/$', views.home_txt),
]
