from django.conf.urls import url
from . import views

urlpatterns =[
	url(r'^$', views.attributes_home, name='attributes_home')
]