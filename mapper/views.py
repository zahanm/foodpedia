
from datetime import datetime

from django.template import Context, loader
from django.shortcuts import render

from mapper.models import Event, Location
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

def event_details(request):
  return render_to_response('eventdetails.html', {})
  
def add_event(request):
  to_add = Event()
  to_add.name = request.POST['name']
  to_add.when = datetime.strptime(request.POST['time'],"%I:%M %p %b %d, %Y")

  where = Location()

  where.latitude = float(request.POST['lat'])
  where.longitude = float(request.POST['long'])
  where.address = request.POST['address']
  where.save()
  to_add.where = where

  to_add.description = request.POST['description']
  tags = request.POST['tags'].split(',')
  tag_string = ""
  for tag in tags:
    tag_string += tag + ";"
  to_add.tags = tag_string

  to_add.save()

  return HttpResponse(to_add.pk, status=201)
