/*

          _/    _/_/    _/_/_/_/_/                              _/       
             _/    _/      _/      _/_/    _/    _/    _/_/_/  _/_/_/    
        _/  _/  _/_/      _/    _/    _/  _/    _/  _/        _/    _/   
       _/  _/    _/      _/    _/    _/  _/    _/  _/        _/    _/    
      _/    _/_/  _/    _/      _/_/      _/_/_/    _/_/_/  _/    _/     
     _/                                                                  
  _/

  Created by David Kaneda <http://www.davidkaneda.com>
  Documentation and issue tracking on Google Code <http://code.google.com/p/jqtouch/>
  
  Special thanks to Jonathan Stark <http://jonathanstark.com/>
  and pinch/zoom <http://www.pinchzoom.com/>
  
  (c) 2009 by jQTouch project members.
  See LICENSE.txt for license.

  Modified by Zahan Malkani https://github.com/zahanm/

*/

(function($) {

  var latitude, longitude, callback, geocoder;
            
  function checkGeoLocation() {
    return navigator.geolocation;
  }

  function updateLocation(fn) {
    if (checkGeoLocation())
    {
      callback = fn;
      navigator.geolocation.getCurrentPosition(savePosition);
      return true;
    } else {
      console.log('Device not capable of geo-location.');
      fn(false);
      return false;
    }                
  }

  function savePosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    if (callback) {
      callback(getLocation());
    }
  }

  function getLocation() {
    if (latitude && longitude) {
      return {
        latitude: latitude,
        longitude: longitude
      }
    } else {
      console.log('No location available. Try calling updateLocation() first.');
      return false;
    }
  }

  /**
   * Assumes that Google Maps API v3 has been loaded
   */

  geocoder = new google.maps.Geocoder();

  function geocode(request, cb) {
    geocoder.geocode(request, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        results[0].geometry.location
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  $.location = function(method, cb) {

    switch(method) {
      case 'update':
        return updateLocation(cb);
      case 'get':
      default:
        return getLocation();
    }

  };

})(jQuery);
