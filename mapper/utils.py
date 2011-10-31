
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
