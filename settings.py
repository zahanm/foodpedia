# Initialize App Engine and import the default settings (DB backend, etc.).
# If you want to use a different backend you have to remove all occurences
# of "djangoappengine" from this file.
from djangoappengine.settings_base import *

import os.path

DEBUG = True
TEMPLATE_DEBUG = DEBUG

cur_dir = os.path.dirname(os.path.abspath(__file__))

TIME_ZONE = 'America/Los_Angeles'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# Activate django-dbindexer for the default database
DATABASES['native'] = DATABASES['default']
DATABASES['default'] = {'ENGINE': 'dbindexer', 'TARGET': 'native'}
AUTOLOAD_SITECONF = 'indexes'

SECRET_KEY = '=r-aasydj98789*(87gmd86%87qw00(*kjcnshw00u&*ebtyy$%2ddd7yd0dbrakhvi'

STATIC_URL = '/static/'

MIDDLEWARE_CLASSES = (
  # This loads the index definitions, so it has to come first
  'autoload.middleware.AutoloadMiddleware',

  'django.middleware.common.CommonMiddleware',
  'django.contrib.sessions.middleware.SessionMiddleware',
  'django.contrib.auth.middleware.AuthenticationMiddleware',
)

TEMPLATE_CONTEXT_PROCESSORS = (
  'django.contrib.auth.context_processors.auth',
  'django.core.context_processors.request',
  'django.core.context_processors.media',
  'django.core.context_processors.static',
)

STATICFILES_FINDERS = (
  'django.contrib.staticfiles.finders.FileSystemFinder',
  'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# This test runner captures stdout and associates tracebacks with their
# corresponding output. Helps a lot with print-debugging.
TEST_RUNNER = 'djangotoolbox.test.CapturingTestSuiteRunner'

ADMIN_MEDIA_PREFIX = '/media/admin/'

TEMPLATE_DIRS = (
  os.path.join(cur_dir, 'templates'),
)

TEMPLATE_LOADERS = (
  'django.template.loaders.filesystem.Loader',
  'django.template.loaders.app_directories.Loader',
)

STATICFILES_DIRS = (
  os.path.join(cur_dir, 'static'),
)

STATICFILES_FINDERS = (
  'django.contrib.staticfiles.finders.FileSystemFinder',
  'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

ROOT_URLCONF = 'urls'

INSTALLED_APPS = (
  'django.contrib.admin',
  'django.contrib.contenttypes',
  'django.contrib.auth',
  'django.contrib.sessions',
  'django.contrib.staticfiles',
  'djangotoolbox',
  'autoload',
  'dbindexer',

  # djangoappengine should come last, so it can override a few manage.py commands
  'djangoappengine',
  'mapper'
)
