import datetime
from django.template import Context, loader
from django.http import HttpResponse

from django.shortcuts import render_to_response
from mapper.models import *



def index(request):
	return render_to_response('index.html', {})

def example(req):
  return render_to_response('scroll/index.html', {})

def eventDetails(request):
	return render_to_response('eventdetails.html', {})
	
def addEvent(request):
	to_add = Event()
	to_add.name = request.POST['name']
	to_add.when = datetime.datetime.strptime(request.POST['time'],"%I:%M %p %b %d, %Y")
	
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
	
	
	return HttpResponse(to_add.pk,status=201)