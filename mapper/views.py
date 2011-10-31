
from datetime import datetime

from django.template import Context, loader
from django.shortcuts import render

from mapper.models import Event
import mapper.utils as utils

def index(request):
	return render(request, 'index.html')

def example(request):
  return render(request, 'scroll/index.html')

def list_events(request):
  events = Event.objects.all() #.order_by('when')
  day_events = {}
  today = datetime.today()
  for event in events:
    diff = utils.format_timedelta(event.when - today)
    if diff not in day_events:
      day_events[diff] = []
    day_events[diff].append(event)
  day_tuples = day_events.items()
  day_tuples.sort()
  return render(request, 'events.json', { 'day_events': day_tuples }, content_type='application/json')
