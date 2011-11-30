
from django.conf.urls.defaults import *

urlpatterns = patterns('mapper.views',
  (r'^$', 'index'),
  (r'^index', 'index'),
  (r'^api/event/all', 'all_events'),
  (r'^api/event/list', 'list_events'),
  (r'^eventdetails', 'event_details'),
  (r'^api/event/add', 'add_event'),
  (r'^api/event/(?P<event_id>\d+)', 'event'),
  (r'^api/event/reset', 'reset_db'),

  # A/B Testing
  # list view inlining changes
  (r'^v2', 'index_b'),
  (r'^api/event/list_b', 'list_events_b'),

  # settings page changes
  (r'^with_settings', 'index_with_settings'),

)
