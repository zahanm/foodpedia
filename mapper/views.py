
from datetime import datetime
import json

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render

from mapper.models import Event, Location
import mapper.utils as utils

def index(request):
  return render(request, 'index.html')

def example(request):
  return render(request, 'scroll/index.html')

def list_events(request):
  today = datetime.today()
  events = Event.objects.all() #.order_by('when')
  segmented_events = {}
  for event in events:
    event_details = {}
    event_details['name'] = event.name
    event_details['pk'] = event.pk	
   # var milli_d2 = today.getTime();
   #%var diff = milli_d1 - milli_d2;
   #var num_days = (((diff / 1000) / 60) / 60) / 24;*/
   # all event should happened before the current time. it should 'be today - event.when'
	# if you want result to be positive
	#alert(" before = " +  event.when + "  after = " + today)
    diff = utils.format_timedelta(today - event.when) #this diff is coming up negative (as in, the interval between when the event happens and today is coming up negative, even if the event happens "right now"
    if diff not in segmented_events:
      segmented_events[diff] = []
    segmented_events[diff].append(event_details)
  # the list is only needed because of the format required clientside
  split_list = []
  for segment in segmented_events:
    dateString = segment
    if segment == "0 day":
	  dateString = "Today"
    if segment == "1 day":
	  dateString = "Tomorrow"
    split_list.append({
      'date': dateString,
      'details': segmented_events[segment]
    })
  # TODO fix to use actual date ordering, once format_timedelta is rewritten, this won't work
  split_list.sort(key=lambda x: x['date'])
  response = HttpResponse(content_type='application/json')
  json.dump({ 'days': split_list }, response)
  return response

def event_details(request):
  return render_to_response('eventdetails.html', {})
  
def add_event(request):
  to_add = Event()
  to_add.name = request.POST['name']
  to_add.when = datetime.strptime(request.POST['time'],"%I:%M %p %m/%d/%Y")

  where = Location()

  where.latitude = float(request.POST['lat'])
  where.longitude = float(request.POST['long'])
  where.address = request.POST['address']
  where.save()
  to_add.where = where

  to_add.description = request.POST['description']

  to_add.save()

  return HttpResponse(to_add.pk, status=201)

def event(request, event_id):
  e = Event.objects.get(pk=event_id)
  tags = e.tags.split(';')[:-1]
  tag_list = []
  for t in tags:
    tag_list.append({"tag":t})
  #cannot use json or django.core.serializers because location object, so must do manually
  json_event = {}
  json_event['pk'] = e.pk
  json_event['name'] = e.name
  json_event['description'] = e.description
  json_event['when'] = e.when.strftime("%I:%M %p %m/%d/%Y")
  json_event['where'] = {"latitude":e.where.latitude, "longitude":e.where.longitude, "address":e.where.address}
  json_event['tags'] = tag_list
  response = HttpResponse(content_type='application/json')
  json.dump({'event':json_event}, response)

  return response
