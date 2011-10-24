from django.template import Context, loader

from django.shortcuts import render_to_response


def index(request):
	return render_to_response('index.html', {})

def example(req):
  return render_to_response('scroll/index.html', {})
