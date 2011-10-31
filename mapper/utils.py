
def format_timedelta(delta):
  if delta.days > 1:
    return "{0} days".format(delta.days)
  return "{0} day".format(delta.days)
