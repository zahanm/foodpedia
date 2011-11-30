
LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#details}}' +
              '<li class="slide arrow">' +
                '<a class="listEvent" href="#event" data-pk="{{pk}}" ' +
                ' data-lat="{{lat}}" data-lng="{{lng}}" ' +
                ' ontouchstart="loadFoodEvent(this)" onclick="loadFoodEvent(this)">' +
                '<table>' +
                  '<tr class="upperrow"><td class="leftcol">{{datetime-figure}}</td><td>{{name}}</td></tr>' +
                  '<tr class="lowerrow"><td class="leftcol">{{datetime-unit}}</td><td>{{dist}} m</td></tr>' +
                '</table>' +
                '</a>' +
              '</li>' +
            '{{/details}}' +
            '{{^details}}' +
              '<li class="slide"><h3>No events. :(</h3></li>' +
            '{{/details}}' +
            '</ul>' +
            '';

LIST_VIEW_DIST = '' +
            '<ul class="edgetoedge">' +
            '{{#dists}}' +
              '<li class="sep">{{sep}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow">' +
                  '<a class="listEvent" href="#event" data-pk="{{pk}}" ' +
                  ' data-lat="{{lat}}" data-lng="{{lng}}" ' +
                  ' ontouchstart="loadFoodEvent(this)" onclick="loadFoodEvent(this)">' +
                  '<span>{{name}}</span><br/>' +
                  '<span class="secondary">{{date}}</span>' +
                  '</a>' +
                '</li>' +
              '{{/details}}' +
            '{{/dists}}' +
            '{{^dists}}' +
              '<li class="slide"><h3>No events. :(</h3></li>' +
            '{{/dists}}' +
            '</ul>' +
            '';

EVENT = '' +
        '{{#event}}' +
        '<div class="toolbar">' +
          '<a class="back" href="#">Back</a>' +
          '<h1>{{name}}</h1>' +
        '</div>' +
        '<div id="eventdetails" >' +
          '<ul class="edgetoedge" class="scroll">' +
            '<li class="sep">Description</li>' +
            '<li> {{description}} </li>' +
            '<li class="sep">Where</li>' +
            '{{#where}}' +
            '<li class="forward"><a href="http://maps.google.com/maps?q={{address}}"> {{address}}</a> </li>' +
            '{{/where}}' +
            '<li class="sep">When</li>' +
            '<li>{{when}}</li>' +
            /*'<li class="sep">Tags</li>' +
            '{{#tags}}' +
            '<li>{{tag}}</li>' +
            '{{/tags}}' +*/
          '</ul>' +
        '</div>' +
        '{{/event}}' +
          '';
          
	
function validateDateTime(){
	
	var date = $('#add_event #add_date').val().split('-');
	
	var time = $('#add_event #add_time').val().split(':');
	var year = parseInt(date[0],10);
	var month = parseInt(date[1],10);
	var day = parseInt(date[2],10);
	var hour = parseInt(time[0],10);
	var minute = parseInt(time[1],10);
	
	
	var today = new Date();
	console.log("today year: " + today.getFullYear() + " entered year: " + year);
	if (year > today.getFullYear()){
		return true;
	} else if (year < today.getFullYear()){
		return false;
	}
	console.log("today month: " + (today.getMonth + 1) + " entered month: " + month);
	if (month > (today.getMonth() + 1)){
		return true;
	} else if (month < (today.getMonth() + 1)){
		return false;
	}
	console.log("today day: " + today.getDate() + " entered day: " + day);
	if (day > today.getDate()){
		return true;
	} else if (day < today.getDate()){
		return false;
	}
	console.log("today hour: " + today.getHours() + " entered hour: " + hour);
	if (hour != 23){
		hour++;
	}
	if (hour > today.getHours()){
		return true;
	} else if (hour < today.getHours()){
		return false;
	}
	console.log("today minute: " + today.getMinutes() + " entered minute: " + minute);
	/*
	if (minute > today.getMinutes()){
		return true;
	} else if (minute < today.getMinutes()){
		return false;
	}
	*/
	return true;
}

	
	


	



	

// -- needed for mobilesafari bug

function loadFoodEvent(el) {
  $('#event_title').html('Loading...');
  $('#event_body').html('');
  var pk = $(el).data('pk');
  $.getJSON('/api/event/' + pk, function(evt) {
      $('#event').html($.mustache(EVENT, evt));
  });
}

function formatDT() {
  var datetime = {
    hour: this.getHours(),
    minute: this.getMinutes(),
    day: this.getDate(),
    month: this.getMonth() + 1,
    year: this.getFullYear()
  }
  return $.mustache(
    "{{hour}}:{{minute}} {{year}}-{{month}}-{{day}}",
    datetime
  );
}

function formatD() {
  var datetime = {
    day: this.getDate(),
    month: this.getMonth() + 1,
    year: this.getFullYear()
  }
  return $.mustache(
    "{{year}}-{{month}}-{{day}}",
    datetime
  );
}

function padN (number, padding) {
  var s = number.toString();
  while (s.length < padding) { s = '0' + s; }
  return s;
}

function formatT(){
		var h = padN(this.getHours(), 2);
		var m = this.getMinutes()
		m = padN(15 * Math.floor(m/15), 2);
		var datetime = {
    hour: h,
    minute: m
  }
  return $.mustache(
    "{{hour}}:{{minute}}",
    datetime
  );
}

function until_time () {
  var until = new Date();
  var time_selector = $('#listview').data('timewindow');
  switch(time_selector) {
    case 'hour':
      until = new Date(until.getTime() + 60 * 60 * 1000);
      break;
    case 'day':
      until = new Date(until.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'week':
      until = new Date(until.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      until = '';
  }
  return until.toString();
}

function refresh_list (el) {
  $.location('update', function(me) {
    var options = {};
    var time_window = until_time();
    if (time_window) {
      options['until'] = time_window;
    }
    $.getJSON('/api/event/list', options, function(event_list) {
      event_list.details.forEach(function(ev) {
        // calculate location
        var loc = {
          latitude: ev.lat,
          longitude: ev.lng
        };
        ev.dist = $.location('distance', me, loc);
        ev.dist = ev.dist.toFixed(2);

        //relatize datetime
        var rel_datetime = $.relatizeDate( ev.datetime );
        ev['datetime-figure'] = rel_datetime.figure;
        ev['datetime-unit'] = rel_datetime.unit;
      });
      var storage = window.sessionStorage;
      storage.setItem('event_list', JSON.stringify(event_list));
      resort_list();
    });
  });
}

// -- sortlist helpers

function resort_list () {
  var storage = window.sessionStorage;
  try {
    var event_list = JSON.parse(storage.getItem('event_list'));
  } catch (err) {
    console.log('event_list not loaded before sort attempted');
    return;
  }
  var sort_type = $('#listview').data('sorttype')
    , sort_button = $('#sortList')[0];
  switch(sort_type) {
    case 'time':
      // now must sort by time
      $('#listview').html($.mustache(LIST_VIEW, event_list));
      // set the button
      sort_button.innerText = 'Sort by distance';
      break;
    case 'distance':
    default:
      dist_bins = {}
      // now must sort by distance
      event_list.details.forEach(function(ev) {
        bin_dist(dist_bins, ev);
      });
      dist_list = [];
      $.each(dist_bins, function(bin, v) {
        dist_bin = parseInt(bin, 10);
        details = $.extend(v, {
          sep: ((dist_bin % 10 == 1) ? '> ' : '< ') + bin + 'm',
          dist_bin: dist_bin
        })
        insert_sorted(dist_list, function(a) { return a['dist_bin']; }, details);
      });
      $('#listview').html($.mustache(LIST_VIEW_DIST, { dists: dist_list }));
      // set the button
      sort_button.innerText = 'Sort by time';
  }
}

function bin_dist (dist_bins, ev) {
  var key = '0';
  if (ev.dist < 100) {
    key = '100';
  } else if (ev.dist < 500) {
    key = '500';
  } else {
    key = '501';
  }
  dist_bins[key] = dist_bins[key] || {};
  dist_bins[key].details = dist_bins[key].details || [];
  insert_sorted(dist_bins[key].details, function(a) { return a['dist']; }, ev);
}

function insert_sorted (arr, key, elem) {
  var ii = 0;
  while (arr[ii] && key(elem) > key(arr[ii])) {
    ii++;
  }
  arr.splice(ii, 0, elem);
}

/**
  --- Setup button handlers
*/

function click_sortChange (el) {
  var cur_sort_type = $('#listview').data('sorttype');
  switch(cur_sort_type) {
    case 'distance':
      $('#listview').data('sorttype', 'time');
      $('#listview').data('timewindow', 'all');
      $('#sortChange').html('Events Now');
      break;
    case 'time':
    default:
      $('#listview').data('sorttype', 'distance');
      $('#listview').data('timewindow', 'hour');
      $('#sortChange').html('All Events');
  }
  refresh_list();
}

function click_timeWindow (el) {
  var time_window = $(el).data('timewindow');
  $('#listview').data('timewindow', time_window);
  $(el).parent().children('.selected').removeClass('selected');
  $(el).addClass('selected');
}

function click_addEvent (el) {
  $('#add_location').val('Loading current location');
  // location
  $.location('update', function(loc) {
    $('#add_location_lat').val(loc.latitude);
    $('#add_location_lng').val(loc.longitude);
    $.location('revgeocode', loc, function(address) {
      $('#add_location').val(address);
    });
  });
  // time
  var now = new Date();
  $('#add_time').val(formatT.call(now));
  $('#add_date').val(formatD.call(now));
}

function click_submit (el) {
  // Disable the submit button
  $('#add_event #add_submit').attr("disabled", "disabled");
  // Clear and hide any error messages
  $('#add_event .formError').html('');
  // Set temaprary variables for the script
  var isFocus=0;
  var isError=0;
  // Get the data from the form

  var name= $('#add_event #add_name').val();
  var location= $('#add_event #add_location').val();
  var lat = $('#add_event #add_location_lat').val();
  var longitude = $('#add_event #add_location_lng').val();
  var date= $('#add_event #add_date').val();
  var time= $('#add_event #add_time').val();
  var description = $('#add_event #add_description').val();
  

  if (name==''){
    $('#add_event #errorName').html('This is a required field.');
    $('#add_event #add_name').focus()
    isFocus = 1;
    isError = 1;
  }

  if (!validateDateTime()){
    $('#add_event #errorDate').html('Error, this time has already passed');
    if (isFocus == 0){
      $('#add_event #add_date').focus();
      isFocus = 1;
    }
    isError = 1;
  }



  // Terminate the script if an error is found
  if(isError==1) {
    // Activate the submit button
    $('#add_event #add_submit').attr("disabled", "");
    return false;
  }

  var dataString = 'name='+ name + '&time=' + time + ' ' + date + '&lat=' + lat + '&long=' + longitude + '&address=' + location + '&description=' + description;

  $.ajax({
    type: "POST",
    url: "/api/event/add_event",
    data: dataString,
    success: function(msg) {
      $('#add_event #add_description').val('');
      $('#add_event #add_name').val('');
      $('#add_event #add_submit').attr("disabled", "");
      window.jQT.goTo("#list", "dissolve");
    },
    error: function(ob,errStr) {
      console.log("nooooo! failure");
      console.log(errStr);
    }

  });

  return false;
}

/* -------------------------------------
 * Post-Pandorification code
 * Save us all.
 *               .     _///_,
 *             .      / ` ' '>
 *               )   o'o __/_'>
 *              (   /  _/  )_\'>
 *               ' "__/   /_/\_>
 *                   ____/_/_/_/
 *                  /,---, _/ /
 *                 ""  /_/_/_/
 *                    /_(_(_(_                 \
 *                   (   \_\_\\_               )\
 *                    \'__\_\_\_\__            ).\
 *                    //____|___\__)           )_/
 *                    |  _  \'___'_(           /'
 *                     \_ (-'\'___'_\      __,'_'
 *                     __) \  \\___(_   __/.__,'
 *                  ,((,-,__\  '", __\_/. __,'
 *                               '"./_._._-'
 */

function fetch_all_events() {
  var storage = window.sessionStorage;
  $.getJSON('/api/event/all', function(r) {
    var events = r['events'];
    storage.setItem('events', JSON.stringify(events));
    $('#nextbutton').removeAttr('disabled');
  });
}

function shuffle_event() {
  var storage = window.sessionStorage;
  var events = JSON.parse(storage.getItem('events'));
  var current = Number($('#eventdetails').data('index'));
  current++;
  if (current >= events.length) {
    current = 0;
  }
  set_homepage(events[current]);
  $('#eventdetails').data('index', current.toString());
}

function set_homepage(ev) {
  $('#ev_name').text(ev.name);
  $('#ev_when').data('when', ev.when);
  $('#ev_image').attr('src', ev.image);
  $('#ev_where').attr('href', "http://maps.google.com/maps?q=" + ev.address);
  $('#ev_where').text(ev.where);
  $('#ev_dist').data('lat', ev.lat);
  $('#ev_dist').data('lon', ev.lon);
  $('#ev_description').text(ev.description);
  relatize_homepage_date();
  calc_homapage_dist();
}

function relatize_homepage_date() {
  var offset = $.relatizeDate($('#ev_when').data('when'))
  $('#ev_when_figure').text(offset.figure);
  $('#ev_when_unit').text(offset.unit);
}

function calc_homapage_dist() {
  $.location('update', function(myloc) {
    var ev_location = {
      latitude: $('#ev_dist').data('lat'),
      longitude: $('#ev_dist').data('lon')
    };
    var dist = $.location('distance', myloc, ev_location);
    $('#ev_dist_figure').text(dist.figure.toFixed(2));
    $('#ev_dist_unit').text(dist.unit);
  });
}

$(document).ready(function() {

  window.jQT = new $.jQTouch({
    icon: '/static/imgs/icon.png',
    addGlossToIcon: false,
    startupScreen: 'jqt_startup.png',
    statusBar: 'black',
    preloadImages: [
      '/static/themes/jqt/img/activeButton.png',
      '/static/themes/jqt/img/back_button.png',
      '/static/themes/jqt/img/back_button_clicked.png',
      '/static/themes/jqt/img/blueButton.png',
      '/static/themes/jqt/img/button.png',
      '/static/themes/jqt/img/button_clicked.png',
      '/static/themes/jqt/img/grayButton.png',
      '/static/themes/jqt/img/greenButton.png',
      '/static/themes/jqt/img/redButton.png',
      '/static/themes/jqt/img/whiteButton.png',
      '/static/themes/jqt/img/loading.gif'
      ]
  });

  // -- listview

  $('#list').bind('pageAnimationEnd', function(e, info) {
    if (info.direction == 'in') {
      refresh_list();
    }
  });

  // -- location_choice

  $('#add_location').blur(function(e) {
    var address = $('#add_location').val();
    if (address) {
      $.location('geocode', address, function(loc) {
        $('#add_location_lat').val(loc.latitude);
        $('#add_location_lng').val(loc.longitude);
      });
    }
  });

  // -- initialize event details
  relatize_homepage_date();
  calc_homapage_dist();
  // get all the other events and store them
  fetch_all_events();
  
});
