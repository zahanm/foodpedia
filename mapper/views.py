
import json
import logging
import sys
from datetime import datetime, timedelta

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render

from mapper.models import Event, Location
from mapper.utils import FixedOffset

def index(request):
  return render(request, 'index.html')

PSTOFFSET = -8

def list_events(request):

  until = None
  if 'until' in request.GET:
    d = request.GET['until']
    d = d.split('GMT')[0].strip()
    try:
      until = datetime.strptime(d, '%a %b %d %Y %H:%M:%S')
      until = until.replace(tzinfo=FixedOffset(PSTOFFSET, 'PST'))
    except:
      sys.stderr.write("Not able to parse 'until' {0}\n".format(request.GET['until']))

  now = datetime.now(tz=FixedOffset(PSTOFFSET, 'PST'))
  now += timedelta(hours = -1)

  events = Event.objects.order_by('when').filter(when__gt=now)

  if until:
    events = events.filter(when__lte=until)

  event_list = []

  for event in events:
    event_details = {}
    event_details['name'] = event.name
    event_details['pk'] = event.pk
    event_details['lat'] = event.where.latitude
    event_details['lng'] = event.where.longitude
    event_details['datetime'] = event.when.isoformat()
    event_list.append(event_details)

  # event_list.sort(key=lambda x: x['datetime'])
  response = HttpResponse(content_type='application/json')
  json.dump({ 'details': event_list }, response)
  return response

def event_details(request):
  return render_to_response('eventdetails.html', {})
  
def add_event(request):
  to_add = Event()
  to_add.name = request.POST['name']
  to_add.when = datetime.strptime(request.POST['time'],"%H:%M %Y-%m-%d")
  to_add.when = to_add.when.replace(tzinfo=FixedOffset(PSTOFFSET, 'PST'))

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
  #json_event['tags'] = tag_list
  response = HttpResponse(content_type='application/json')
  json.dump({'event':json_event}, response)

  return response
