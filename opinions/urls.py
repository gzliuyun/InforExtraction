from django.conf.urls import url
from . import views

urlpatterns =[
        url(r'^txt/$', views.opinions_txt),
        url(r'^library/$',views.opinions_library),
        url(r'^search/$',views.opinions_search),
		url(r'^news/\d$',views.news),
        url(r'^txt/submit/$',views.opinions_txt_submit),
        url(r'^bt/table/$',views.bt_table),
]
