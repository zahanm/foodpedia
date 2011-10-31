
from django.conf.urls.defaults import *

urlpatterns = patterns('mapper.views',
	(r'^index', 'index'),
  (r'^example', 'example'),
  (r'^api/event/list', 'list_events'),
  (r'^eventdetails', 'event_details'),
  (r'^api/event/add', 'add_event'),
  (r'^api/event/(?P<event_id>\d+)', 'event'),
)
