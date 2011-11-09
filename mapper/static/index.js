
LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#days}}' +
              '<li class="sep">{{date}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow">' +
                  '<a class="listEvent" href="#event" data-pk="{{pk}}" ' +
                  ' data-lat="{{lat}}" data-lng="{{lng}}" ' +
                  ' ontouchstart="loadFoodEvent(this)" onclick="loadFoodEvent(this)">' +
                  '<span>{{name}}</span><br/>' +
                  '<span class="secondary">{{dist}} m</span>' +
                  '</a>' +
                '</li>' +
              '{{/details}}' +
            '{{/days}}' +
            '{{^days}}' +
              '<li class="slide"><h3>No events. :(</h3></li>' +
            '{{/days}}' +
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
            '<li class="forward"><a href="http://maps.google.com/maps?q={{address}}@{{latitude}},{{longitude}}"> {{address}}</a> </li>' +
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
          
          
          
function selectDate(){
	console.log("whatever");
	var prev_time = $("#add_time").val();
	var index_of_colon = prev_time.indexOf(':');
	var index_of_space = prev_time.indexOf(' ');
	
	var prev_hour = prev_time.substring(0, index_of_colon);
	var prev_min = prev_time.substring(index_of_colon + 1, index_of_space);
	var prev_mod = prev_time.substring(prev_time.length - 2);
	
	var minutes = {0:'00', 15:'15', 30:'30', 45:'45'}
	var hours = {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, 11:11, 12:12}
	var mod = {'AM':'AM', 'PM':'PM'}
	
	SpinningWheel.addSlot(hours, 'center', prev_hour);
	SpinningWheel.addSlot({separator:':'}, 'readonly shrink');
	SpinningWheel.addSlot(minutes, 'center', prev_min);
	SpinningWheel.addSlot(mod, 'center', prev_mod);

	SpinningWheel.setCancelAction(cancel);
	SpinningWheel.setDoneAction(done);

	SpinningWheel.open();
}

function done() {
	var results = SpinningWheel.getSelectedValues();
	$('#time').val(results.values[0]+ ':' + results.values[2] + ' ' + results.values[3]);
}

function cancel() {
}
	
function validateDate(){
	var date = $('#add_event #add_date').val().split('/');
	if (date.length > 3){
		console.log("day too long" + date.length);
		return false;
	}
	var month = parseInt(date[0]);

	if (isNaN(month) || month < 1 || month > 12){
		console.log("month is " + month);
		return false;
	}
	var day = parseInt(date[1]);
	if (isNaN(day) || day < 1 || day > 31){
		console.log("day is " + day);
		return false;
	}
	
	
	var year = parseInt(date[2]);
	if (isNaN(year) || year < new Date().year){
		console.log("year is " + year);
		return false;
	}
	
	return true;
}

function validateTime(){
	var time = $('#add_event #add_time').val();
	var index_of_colon = time.indexOf(':');
	var index_of_space = time.indexOf(' ');
	
	var hour = parseInt(time.substring(0, index_of_colon));
	if (isNaN(hour) || hour < 1 || hour > 12){
		console.log("hour is " + hour);
		return false;
	}
	var minute = parseInt(time.substring(index_of_colon + 1, index_of_space));
	if (isNaN(minute) || minute < 0 || minute > 59){
		console.log("minute is " + minute);
		return false;
	}
	var ampm = time.substring(index_of_space + 1).toUpperCase();
	if (ampm == '' || (ampm != 'AM' && ampm != 'PM')){
		console.log("ampm is '" + ampm + "'");
		return false;
	}
	return true;
}
	
	


	



	

// -- needed for mobilesafari bug

function loadFoodEvent(el) {
  $('#event_title').html('Loading...');
  $('#event_body').html('');
  var pk = $(el).data('pk');
  $.getJSON('/api/event/' + pk, function(event) {
      $('#event').html($.mustache(EVENT, event));
  });
}

function formatDT() {
  var h = this.getHours() % 12;
  if (h == 0){
    h = 12;
  }
  var datetime = {
    hour: h,
    minute: this.getMinutes(),
    ampm: this.getHours() < 12 ? 'AM': 'PM',
    day: this.getDate(),
    month: this.getMonth() + 1,
    year: this.getFullYear()
  }
  return $.mustache(
    "{{hour}}:{{minute}} {{ampm}} {{month}}/{{day}}/{{year}}",
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
    "{{month}}/{{day}}/{{year}}",
    datetime
  );
}

function formatT(){
		var h = this.getHours() % 12;
		if (h == 0){
			h = 12;
		}
		var m = this.getMinutes()
		m = (15 * Math.floor(m/15))
		if (m == 0){
			m = "0" + m
		}
	  var datetime = {
    hour: h,
    minute: m,
    ampm: this.getHours() < 12 ? 'AM': 'PM'
  }
  return $.mustache(
    "{{hour}}:{{minute}} {{ampm}}",
    datetime
  );
}

function refreshList (el) {
  $.location('update', function(me) {
    $.getJSON('/api/event/list',function(day_list) {
      day_list.days.forEach(function(day_events) {
        day_events.details.forEach(function(ev) {
          var loc = {
            latitude: ev.lat,
            longitude: ev.lng
          };
          ev.dist = $.location('distance', me, loc);
          ev.dist = ev.dist.toFixed(2);
        });
      });
      var storage = window.sessionStorage;
      storage.setItem('day_list', JSON.stringify(day_list));
      $('#listview').html($.mustache(LIST_VIEW, day_list));
    });
  });
}

// -- sortlist helpers

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

function click_sortList (el) {
  var storage = window.sessionStorage;
  try {
    var day_list = JSON.parse(storage.getItem('day_list'));
  } catch (err) {
    console.log('day_list not loaded before sort attempted');
    return;
  }
  var sortButton = $('#sortList')[0];
  switch(sortButton.innerText) {
    case 'By Time':
      // now must sort by time
      $('#listview').html($.mustache(LIST_VIEW, day_list));
      // toggle the button
      sortButton.innerText = 'By Distance';
      break;
    case 'By Distance':
    default:
      dist_bins = {}
      // now must sort by distance
      day_list.days.forEach(function(day_events) {
        day_events.details.forEach(function(ev) {
          bin_dist(dist_bins, ev);
        });
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
      // toggle the button
      sortButton.innerText = 'By Time';
  }
}

function click_addEvent (el) {
  $('#location').val('Loading current location');
  // location
  $.location('update', function(loc) {
    $('#location_lat').val(loc.latitude);
    $('#location_lng').val(loc.longitude);
    $.location('revgeocode', loc, function(address) {
      $('#location').val(address);
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

  if (!validateDate()){
    $('#add_event #errorDate').html('Incorrect Format. Please use: MM/DD/YYYY');
    if (isFocus == 0){
      $('#add_event #add_date').focus();
      isFocus = 1;
    }
    isError = 1;
  }

  if (!validateTime()){
  $('#add_event #errorTime').html('Incorrect Format. Please use: HH:MM AM/PM');
    if (isFocus == 0){
      $('#add_event #add_time').focus()
      isFocus = 1;
    }
    isError = 1;
  }

  if (description==''){
  $('#add_event #errorDescription').html('This is a required field.');
    if (isFocus == 0){
      $('#add_event #add_description').focus()
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
      $('#add_event #add_description').val('')
      $('#add_event #add_name').val('')
      $('#add_event #add_submit').attr("disabled", "");
      window.jQT.goTo("#list", "dissolve")
    },
    error: function(ob,errStr) {
      console.log("nooooo! failure");
      console.log(errStr);
    }

  });

  return false;
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
      refreshList();
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

  // -- init events
  refreshList();
  
});
