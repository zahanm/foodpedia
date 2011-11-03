from django.conf.urls.defaults import *

handler500 = 'djangotoolbox.errorviews.server_error'

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
  ('^_ah/warmup$', 'djangoappengine.views.warmup'),
  (r'^admin/', include(admin.site.urls)),
  (r'^', include('mapper.urls')),
  (r'^mapper/', include('mapper.urls')),
)
