
from django.conf.urls.defaults import *

urlpatterns = patterns('mapper.views',
	(r'^index', 'index'),
  (r'^example', 'example'),
  (r'^eventdetails', 'eventDetails'),
  (r'^api/event/add', 'addEvent'),
)
