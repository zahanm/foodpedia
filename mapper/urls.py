
from django.conf.urls.defaults import *
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = patterns('mapper.views',
	(r'^index', 'index'),
  (r'^example', 'example'),
)

urlpatterns += staticfiles_urlpatterns()
