
LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#days}}' +
              '<li class="sep">{{date}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow">' +
                  '<a class="listEvent" href="#event" data-pk="{{pk}}" ' + 
                  ' data-lat="{{lat}}" data-lng="{{lng}}" ' +
                  ' ontouchstart="loadFoodEvent(this)">{{name}}</a>' +
                '</li>' +
              '{{/details}}' +
            '{{/days}}' +
            '{{^days}}' +
              '<li class="slide"><h3>No events. :(</h3></li>' +
            '{{/days}}' +
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

	if (year > today.getFullYear()){
		return true;
	} else if (year < today.getFullYear()){
		return false;
	}
	
	if (month > (today.getMonth() + 1)){
		return true;
	} else if (month < (today.getMonth() + 1)){
		return false;
	}
	if (day > today.getDate()){
		return true;
	} else if (day < today.getDate()){
		return false;
	}
	if (hour > today.getHours()){
		return true;
	} else if (hour < today.getHours()){
		return false;
	}
	if (minute > today.getMinutes()){
		return true;
	} else if (minute < today.getMinutes()){
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

/**
  --- Setup button handlers
*/

function click_refreshList (el) {
  $.getJSON('/api/event/list',function(event_list) {
    $('#listview').html($.mustache(LIST_VIEW, event_list));
  });
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
  //$('#add_time').val(formatT.call(now));
  //$('#add_date').val(formatD.call(now));
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
      $('#refreshList').click();
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
  $('#refreshList').click();

  
});
