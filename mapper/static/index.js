
LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#days}}' +
              '<li class="sep">{{date}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow">' +
                  '<a class="listEvent" href="#event" data-pk="{{pk}}" onclick="loadFoodEvent(this)">{{name}}</a>' +
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
            '<li><a href="http://maps.google.com/maps?q={{address}}@{{latitude}},{{longitude}}"> {{address}}</a> </li>' +
            '{{/where}}' +
            '<li class="sep">When</li>' +
            '<li>{{when}}</li>' +
            '<li class="sep">Tags</li>' +
            '{{#tags}}' +
            '<li>{{tag}}</li>' +
            '{{/tags}}' +
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
	var hours = {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 101:10, 11:11, 12:12}
	var mod = {'AM':'AM', 'PM':'PM'}
	
	SpinningWheel.addSlot(hours, 'center', prev_hour)
	SpinningWheel.addSlot({separator:':'}, 'readonly shrink')
	SpinningWheel.addSlot(minutes, 'center', prev_min)
	SpinningWheel.addSlot(mod, 'center', prev_mod)
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

// -- needed for mobilesafari bug

function loadFoodEvent(el) {
  $('#event').html('Loading...');
  var pk = $(el).data('pk');
  $.getJSON('/api/event/' + pk, function(event) {
      $('#event').html($.mustache(EVENT, event));
  });
}

function formatDT() {
  var datetime = {
    hour: this.getHours() % 12, // TODO FIXME doesn't work for 12 PM
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

$(document).ready(function() {

  var jQT = new $.jQTouch({
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

  /**
    --- Setup button handlers
  */

  // -- listview

  $('#refreshList').click(function(e) {
    $.getJSON('/api/event/list',function(event_list) {
      $('#listview').html($.mustache(LIST_VIEW, event_list));
    });
  });



  $('#list').bind('pageAnimationEnd', function(e, info) {
    if (info.direction == 'in') {
      $('#refreshList').click();
    }
  });

  // -- location_choice

  $('#autofillButton').click(function(e) {
    $('#location').val('Loading current location');
    $('#time').val('Loading current time');
    // location
    $.location('update', function(loc) {
      $.location('revgeocode', loc, function(address) {
        $('#location').val(address);
      });
    });
    // time
    var now = new Date();
    $('#time').val(formatDT.call(now));
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
