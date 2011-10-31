


LIST_VIEW = '' +
            '<ul class="edgetoedge">' +
            '{{#days}}' +
              '<li class="sep">{{date}}</li>' +
              '{{#details}}' +
                '<li class="slide arrow"><a href="#event">{{name}}</a></li>' +
              '{{/details}}' +
            '{{/days}}' +
            '{{^days}}' +
              '<li class="slide"><h3>No events. :(</h3></li>' +
            '{{/days}}' +
            '</ul>' +
            '';


EVENT = '' +
      	'<ul class="edgetoedge">' +
      	'{{#event}}' +
      		'<li class="sep">Description</li>' +
      		'<li> {{description}} </li>' +
      		'<li class="sep">Where</li>' +
      		'{{#where}}' +
      		'<li> {{address}} </li>' +
      		'{{/where}}' +
      		'<li class="sep">When</li>' +
      		'<li>{{when}}</li>' +
      		'<li class="sep">Tags</li>' +
      		'{{#tags}}' +
      		'<li>{{tag}}</li>' +
      		'{{/tags}}' +
      	'{{/event}}' +
      	'</ul>'+
      	'';

/*                        
                        <li> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis in augue massa, vitae hendrerit enim. Aliquam eget urna massa, quis facilisis leo. Morbi non augue eget dolor commodo auctor a ut lacus. Suspendisse at lectus mauris. </li>
                        <li class="sep">Tags</li>
                        <li><a href="#old_interest">Burgers</a></li>
                        <li><a href="#new_interest">American</a> </li>
                        <li class="sep">Time</li>
                        <li>Friday, November 4 2011</li>
                        <li class="sep">Location</li>
                        <li><a href="http://maps.google.com/maps?saddr=37.426905,-122.171615&daddr=512+Campus+Drive,+Stanford,+CA&hl=en&ll=37.425457,-122.165437&spn=0.025867,0.022058&sll=37.42544,-122.16546&sspn=0.025867,0.022058&geocode=FdkWOwIdIc-3-A%3BFZ4VOwIdqv-3-CmPXrJj2bqPgDEGzRttnV93gw&vpsrc=0&dirflg=w&mra=ltm&glp=1&t=m&z=15">512 Campus Drive </a></li>
                    </ul>
                    <ul class="individual">
                        <li><a href="http://maps.google.com/maps?saddr=37.426905,-122.171615&daddr=512+Campus+Drive,+Stanford,+CA&hl=en&ll=37.425457,-122.165437&spn=0.025867,0.022058&sll=37.42544,-122.16546&sspn=0.025867,0.022058&geocode=FdkWOwIdIc-3-A%3BFZ4VOwIdqv-3-CmPXrJj2bqPgDEGzRttnV93gw&vpsrc=0&dirflg=w&mra=ltm&glp=1&t=m&z=15"> Get Directions</a></li>
                        
                        <li><a href="#profile">Add to My Events</a></li>
                    </ul>  

*/
$(function(){

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
  $('#listButton').click(function(e) {
    $.getJSON('/mapper/api/event/list',function(event_list) {
      $('#listview').html($.mustache(LIST_VIEW, event_list));
    });
  });

  $('#refreshList').tap(function(e) {
    $.getJSON('/mapper/api/event/list',function(event_list) {
      $('#listview').html($.mustache(LIST_VIEW, event_list));
    });
  });
  
  $('#eventPull').tap(function(e) {
    $.getJSON('/mapper/api/event/51',function(event) {
				$('#eventdetails').html($.mustache(EVENT, event))
    });
  });

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
