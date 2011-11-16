
from django.conf.urls.defaults import *

urlpatterns = patterns('mapper.views',
  (r'^$', 'index'),
  (r'^index', 'index'),
  (r'^v2', 'b_index'),
  (r'^api/event/list_b', 'list_events_b'),
  (r'^api/event/list', 'list_events'),
  (r'^eventdetails', 'event_details'),
  (r'^api/event/add', 'add_event'),
  (r'^api/event/(?P<event_id>\d+)', 'event'),
)
