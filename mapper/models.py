
from django.db import models

class Location(models.Model):
  latitude = models.FloatField()
  longitude = models.FloatField()
  address = models.TextField(blank=True, max_length=200) # Can be blank, not needed
  def __unicode__(self):
    return "({0}, {1}): {2} {3}".format(self.latitude, self.longitude, self.building, self.address)

class Event(models.Model):
  name = models.CharField(max_length=100)
  when = models.DateTimeField("Time the event is taking place")
  # can access all locations using Event.location_set.all()
  where = models.ForeignKey(Location)
  description = models.TextField()
  # HACK, check max_length in practice
  # separator between tags is ;
  tags = models.CharField(blank=True, max_length=200)
  def __unicode__(self):
    return "{0}: {1}, {2}".format(self.name, self.when, self.where)
