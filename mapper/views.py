
import json
import logging
import sys
from datetime import datetime
from datetime import timedelta

from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render, redirect

from mapper.models import Event, Location
from mapper.utils import FixedOffset

def index(req):
  # pick a random event happening soon and close and pass it as context
  event = Event.objects.order_by('when')[0]
  return render(req, 'index.html', { 'event': event_for_client(event) })

def all_events(req):
  # give back a json_array with all the events
  db_evs = Event.objects.order_by('when')
  events = [ event_for_client(db_ev) for db_ev in db_evs ]
  res = HttpResponse(content_type='application/json')
  json.dump({ 'events': events }, res)
  return res

def event_for_client(event):
  d = {}
  d['name'] = event.name
  d['when'] = event.when.strftime("%a, %d %b %Y %H:%M:%S GMT%z") # ITEF, js parsable
  d['description'] = event.description
  d['image'] = event.image_url
  d['where'] = event.where.building
  d['address'] = event.where.address
  d['lat'] = event.where.latitude
  d['lon'] = event.where.longitude
  return d

PSTOFFSET = -8

def reset_db(request):
	Event.objects.all().delete()
	Location.objects.all().delete()
	
	tm = datetime.now(tz=FixedOffset(PSTOFFSET, 'PST'))
	base = tm - timedelta(minutes=tm.minute % 30, seconds=tm.second, microseconds=tm.microsecond)
	
	data = [('Whine and Cheese', base + timedelta(hours = 0, minutes = 0), 'Enjoy a fun afternoon with your RFs and let off some steam! Free burgers and fries.', '/static/imgs/1.png', 37.4244677, -122.16637889999998, '618 Escondido Rd, Stanford CA 94305', 'Stern Hall'),
			('Overseas Info Session', base + timedelta(hours = 0, minutes = 45), 'Thinking about going abroad? Info session today to learn about what the Bing program has to offer you. Lunch provided.',  '/static/imgs/2.png', 37.4223369, -122.1557191, '725 Escondido Rd, Stanford CA 94305', 'Mirrielees'),
			('Community Pot Luck', base + timedelta(hours = 1, minutes = 0), 'The Stanford has not shared a meal together in far too long! Bring some food and get some food today!', '/static/imgs/3.png', 37.4221702, -122.16796340000002, '565 Mayfield Ave, Stanford CA 94305', 'Haas Center'),
			('Biology Department BBQ', base + timedelta(hours = 1, minutes = 0), 'Biology Department annual picnic. Sandwiches for everyone', '/static/imgs/4.png', 37.4225305, -122.16902270000003, '417 Mayfield Ave, Stanford CA 94305', 'Levin Field'),
			('Dominos Giveaway', base + timedelta(hours = 1, minutes = 30), 'Dominos is giving away pizza to promote the new 10 foot pizza! Come to the oval for free, tasty pizza!', '/static/imgs/5.png', 37.4283681, -122.16694740000003, '516 Serra Mall, Stanford CA 94305', 'The Oval'),
			('Free Pancackes for Jesus', base + timedelta(hours = 1, minutes = 45),'We want to spend some time talking to you about Jesus, and to entice you we are providing free pancakes! Yum!', '/static/imgs/6.png', 37.4253224, -122.17352779999999, '317 Santa Teresa Ave, Stanford CA 94305', 'Roble Field'),
			('Dewy Decimal Appreciation Day!', base + timedelta(hours = 2, minutes = 0),'The Librarians want to remind you how important the Dewy Decimal system is! Brownies and milk served outside Green!', '/static/imgs/7.png', 37.426824, -122.16585320000002, '600 Crothers Way, Stanford CA 94305', 'Green Library'),
			('Open house at the GSB', base + timedelta(hours = 5, minutes = 15),'The GSB would like to show Stanford just how nice the new Business School is. Come check it out and grab some dinner with us!', '/static/imgs/8.png', 37.4295811, -122.16577430000001,'501 Memorial Way, Stanford CA 94305', 'GSB'),
			('Chipotle at Meyer', base + timedelta(hours = 6, minutes = 0),'Due to a massive accounting error, we have found ourselves with hundreds of extra burritos. Come grab a free one tonight!', '/static/imgs/9.png', 37.4195909, -122.16989999999998,'1040 Campus Drive, Stanford CA 94305', 'Meyer Library'),
			('Hot dogs and soda at BASEBALL GAME', base + timedelta(hours = 6, minutes = 30),'Tonight at Stanford Baseball we are giving vouchers for free soda and hotdogs to the first 200 students that show up. Must show SUID.', '/static/imgs/10.png', 37.430656, -122.1588329,'645 Nelson Road, Stanford CA 94305', 'Sunken Diamond'),
			('Facebook in White Plaza', base + timedelta(hours = 6, minutes = 30), 'Facebook is spreading the love with free Jamba Juice!', '/static/imgs/11.png', 37.4235194, -122.17236250000002, '475 Lagunita Drive, Stanford CA 94305', 'White Plaza'),
			('Teach for America dinner', base + timedelta(hours = 6, minutes = 30), 'Always wanted to help the world where it counts? Come to dinner and hear all about how you can make a difference with Teach for America.', '/static/imgs/5.png', 37.421149, -122.16506600000002, '612 Alvarado Row, Stanford CA 04305', 'Munger'),
			('Chicken finger for your thoughts', base + timedelta(hours = 10, minutes = 30), 'Late Nite will give you a free chicken finger if you share with us one interesting fact you studied tonight',  '/static/imgs/12.png', 37.4235206, -122.16510410000001, '609 Arguello Way, Stanford CA 94305', 'The Dish at Stern')]
	
	for t in data:
		E = Event()
		E.name = t[0]
		E.when = t[1]
		E.description = t[2]
		E.image_url = t[3]
		
		L = Location()
		L.latitude = t[4]
		L.longitude = t[5]
		L.address = t[6]
		L.building = t[7]
		L.save()
		
		E.where = L 
		E.save()
	
	return redirect('/')


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
    event_details['datetime'] = event.when.strftime("%a, %d %b %Y %H:%M:%S GMT%z") # IETF syntax
    event_list.append(event_details)

  response = HttpResponse(content_type='application/json')
  json.dump({ 'details': event_list }, response)
  return response
  

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
  json_event['when'] = e.when.strftime("%I:%M %p %m/%d/%Y") # "%a, %d %b %Y %H:%M:%S GMT%z" ITEF, js parsable
  json_event['where'] = {"latitude":e.where.latitude, "longitude":e.where.longitude, "address":e.where.address, "building":e.where.building}
  #json_event['tags'] = tag_list
  json_event['image'] = e.image_url
  response = HttpResponse(content_type='application/json')
  json.dump({'event':json_event}, response)

  return response

###
# -----------------------------------------------
# --- OLD CODE
#
###

def index_b(request):
  return render(request, 'index_b.html')

def index_with_settings(req):
  return render(req, 'index_settings.html')

def list_events_b(request):

  until = None
  if 'until' in request.GET:
    d = request.GET['until']
    d = d.split('GMT')[0].strip()
    try:
      until = datetime.strptime(d, '%a %b %d %Y %H:%M:%S')
      until = until.replace(tzinfo=FixedOffset(PSTOFFSET, 'PST'))
    except:
      sys.stderr.write("Not able to parse 'until' {0}\n".format(request.GET['until']))

  today = datetime.now(tz=FixedOffset(PSTOFFSET, 'PST'))
  today += timedelta(hours = -1)

  events = Event.objects.all().filter(when__gt=today)

  if until:
    events = events.filter(when__lte=until)

  segmented_events = {}
  for event in events:
    event_details = {}
    event_details['name'] = event.name
    event_details['pk'] = event.pk
    event_details['lat'] = event.where.latitude
    event_details['lng'] = event.where.longitude

    if event.when.date() not in segmented_events:
      segmented_events[event.when.date()] = []
    segmented_events[event.when.date()].append(event_details)
  # the list is only needed because of the format required clientside

  split_list = []

  for segment in segmented_events:

    dateString = segment.strftime("%m/%d/%Y")
    if segment == datetime.now(tz=FixedOffset(PSTOFFSET, 'PST')).date():
      dateString = "Today"

    split_list.append({
      'date': dateString,
      'd': segment.strftime("%m/%d/%Y"),
      'details': segmented_events[segment]
    })

  split_list.sort(key=lambda x: x['d'])
  response = HttpResponse(content_type='application/json')
  json.dump({ 'days': split_list }, response)
  return response

def event_details(request):
  return render_to_response('eventdetails.html', {})
