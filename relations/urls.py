from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^$', views.relations_home, name='relations_home')
]