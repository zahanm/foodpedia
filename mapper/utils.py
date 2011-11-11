
'''
TODO
This needs to be made to do better stuff
Like today, tomorrow and stuff like that
Maybe segment weeks at a time after 7 days?
'''
def format_timedelta(delta):
  if delta.days > 1:
    return "{0} days".format(delta.days)
  return "{0} day".format(delta.days)

# A class building tzinfo objects for fixed-offset time zones.
# Note that FixedOffset(0, "UTC") is a different way to build a
# UTC tzinfo object.

from datetime import tzinfo, timedelta, datetime

ZERO = timedelta(0)

class FixedOffset(tzinfo):
  """Fixed offset in minutes east from UTC."""

  def __init__(self, offset, name):
    self.__offset = timedelta(hours = offset)
    self.__name = name

  def utcoffset(self, dt):
    return self.__offset

  def tzname(self, dt):
    return self.__name

  def dst(self, dt):
    return ZERO
