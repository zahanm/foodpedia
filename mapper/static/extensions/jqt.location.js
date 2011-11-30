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

  var latitude, longitude, callback;
            
  function checkGeoLocation() {
    return navigator.geolocation && navigator.userAgent.indexOf('Simulator') < 0;
  }

  function updateLocation(fn) {
    if (checkGeoLocation())
    {
      callback = fn;
      navigator.geolocation.getCurrentPosition(savePosition);
      return true;
    } else {
      console.log('Device not capable of geo-location. Or it is the damn iPhone simulator.');
      fn({
        latitude: 37.4241059,
        longitude: -122.166075
      });
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

  /**
   * Pass in address
   * callback is invoked with { 'latitude': 32, 'longitude': -122 }
   */
  function geocode(address, cb) {
    var request = {
      'address': address
    };
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(request, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          var loc = results[0].geometry.location;
          cb({
            'latitude': loc.lat(),
            'longitude': loc.lng()
          });
        }
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
        cb(address);
      }
    });
  }

  /**
   * Pass in object of form
   * {
   *   'latitude': 32,
   *   'longitude': -122
   * }
   * callback is invoked with closest match address
   */
  function revgeocode(loc, cb) {
    var request = {
      'latLng': new google.maps.LatLng(loc.latitude, loc.longitude)
    };
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(request, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          cb(results[0].formatted_address);
        }
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
        cb('(Latitude: ' + loc.latitude + ', Longitude: ' + loc.longitude + ')');
      }
    });
  }

  function distance (loc1, loc2) {
    var latlng1 = new google.maps.LatLng(loc1.latitude, loc1.longitude)
      , latlng2 = new google.maps.LatLng(loc2.latitude, loc2.longitude);
    return {
      figure: google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2),
      unit: 'meters'
    };
  }

  /**
   * @params method, [other args...], callback
   */
  $.location = function() {
    var args = Array.prototype.slice.call(arguments);
    var method = args.shift();
    switch(method) {
      case 'update':
        var cb = args.pop();
        return updateLocation(cb);
      case 'geocode':
        var cb = args.pop()
          , address = args.pop();
        return geocode(address, cb);
      case 'revgeocode':
        var cb = args.pop()
          , loc = args.pop();
        return revgeocode(loc, cb);
      case 'distance':
        var loc1 = args.pop();
        var loc2 = args.pop();
        return distance(loc1, loc2);
      case 'get':
      default:
        return getLocation();
    }

  };

})(jQuery);
