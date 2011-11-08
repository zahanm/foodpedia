
LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#days}}' +
              '<li class="sep">{{date}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow">' +
                  '<a class="listEvent" href="#event" data-pk="{{pk}}" ' + 
                  ' data-lat="{{lat}}" data-lng="{{lng}}" ' +
                  ' onclick="loadFoodEvent(this)">{{name}}</a>' +
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
	var prev_time = $("#time_chooser").val();
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
	$('#time_chooser').val(results.values[0]+ ':' + results.values[2] + ' ' + results.values[3]);
}

function cancel() {
}
	
function validateDate(){
	var date = $('#add_event #date').val().split('/');
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
	var time = $('#add_event #time').val();
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
  $('#event').html('Loading...');
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
	  var datetime = {
    hour: h,
    minute: this.getMinutes(),
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
  $('#time').val(formatT.call(now));
  $('#date').val(formatD.call(now));
}

function click_submit (el) {
  // Disable the submit button
  $('#add_event #submit').attr("disabled", "disabled");
  // Clear and hide any error messages
  $('#add_event .formError').html('');
  // Set temaprary variables for the script
  var isFocus=0;
  var isError=0;
  // Get the data from the form

  var name= $('#add_event #name').val();
  var location= $('#add_event #location').val();
  var lat = $('#add_event #location_lat').val();
  var longitude = $('#add_event #location_lng').val();
  var date= $('#add_event #date').val();
  var time= $('#add_event #time').val();
  var description = $('#add_event #description').val();

  if (name==''){
    $('#add_event #errorName').html('This is a required field.');
    $('#add_event #name').focus()
    isFocus = 1;
    isError = 1;
  }

  if (!validateDate()){
    $('#add_event #errorDate').html('Incorrect Format. Please use: MM/DD/YYYY');
    if (isFocus == 0){
      $('#add_event #date').focus();
      isFocus = 1;
    }
    isError = 1;
  }

  if (!validateTime()){
  $('#add_event #errorTime').html('Incorrect Format. Please use: HH:MM AM/PM');
    if (isFocus == 0){
      $('#add_event #time').focus()
      isFocus = 1;
    }
    isError = 1;
  }

  if (description==''){
  $('#add_event #errorDescription').html('This is a required field.');
    if (isFocus == 0){
      $('#add_event #description').focus()
      isFocus = 1;
    }
    isError = 1;
  }


  // Terminate the script if an error is found
  if(isError==1) {
    // Activate the submit button
    $('#add_event #submit').attr("disabled", "");
    return false;
  }

  var dataString = 'name='+ name + '&time=' + time + ' ' + date + '&lat=' + lat + '&long=' + longitude + '&address=' + location + '&description=' + description;

  $.ajax({
    type: "POST",
    url: "/api/event/add_event",
    data: dataString,
    success: function(msg) {
      $('#add_event #description').val('')
      $('#add_event #name').val('')
      $('#add_event #submit').attr("disabled", "");
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

  $('#location').blur(function(e) {
    var address = $('#location').val();
    if (address) {
      $.location('geocode', address, function(loc) {
        $('#location_lat').val(loc.latitude);
        $('#location_lng').val(loc.longitude);
      });
    }
  });

  // -- init events
  $('#refreshList').click();

  /* SAMPLE
  $.location('update', function(loc) {
    console.log('latitude', loc.latitude, 'longitude', loc.longitude);
    console.log("From now on, it's cached", $.location('get').latitude, $.location('get').longitude);
  }); */
  
  /*
  // Show a swipe event on swipe test
  $('#swipeme').swipe(function(evt, data) {
    $(this).html('You swiped <strong>' + data.direction + '/' + data.deltaX +':' + data.deltaY + '</strong>!');
    $(this).parent().after('<li>swiped!</li>')

  });
  $('#tapme').tap(function(){
    $(this).parent().after('<li>tapped!</li>')
  })
  $('a[target="_blank"]').click(function() {
    if (confirm('This link opens in a new window.')) {
      return true;
    } else {
      return false;
    }
  });
  // Page animation callback events
  $('#pageevents').
    bind('pageAnimationStart', function(e, info){ 
      $(this).find('.info').append('Started animating ' + info.direction + '&hellip; ');
    }).
    bind('pageAnimationEnd', function(e, info){
      $(this).find('.info').append(' finished animating ' + info.direction + '.<br /><br />');
    });
  // Page animations end with AJAX callback event, example 1 (load remote HTML only first time)
  $('#callback').bind('pageAnimationEnd', function(e, info){
    // Make sure the data hasn't already been loaded (we'll set 'loaded' to true a couple lines further down)
    if (!$(this).data('loaded')) {
      // Append a placeholder in case the remote HTML takes its sweet time making it back
      // Then, overwrite the "Loading" placeholder text with the remote HTML
      $(this).append($('<div>Loading</div>').load('ajax.html .info', function() {        
        // Set the 'loaded' var to true so we know not to reload
        // the HTML next time the #callback div animation ends
        $(this).parent().data('loaded', true);
      }));
    }
  });
  // Orientation callback event
  $('#jqt').bind('turn', function(e, data){
    $('#orient').html('Orientation: ' + data.orientation);
  });
  $('#play_movie').bind('tap', function(){
    $('#movie').get(0).play();
    $(this).removeClass('active');
  });
  
  $('#video').bind('pageAnimationStart', function(e, info){
    $('#movie').css('display', 'none');
  }).bind('pageAnimationEnd', function(e, info){
    if (info.direction == 'in') {
      $('#movie').css('display', 'block');
    }
  })
  */
});
