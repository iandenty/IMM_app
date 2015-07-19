$(function() {

  if($('.commodity #map').length > 0){ 

    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    var map = L.map('map', {
        scrollWheelZoom: false,
        center: [0, 0],
        zoom: 2
    });

    map.addLayer(layer);

    //update output from slider
    $('#year').change(function(){
      console.log($('#year').val())
      $('#output-year').val($('#year').val());
    })

    //style buttons
    var buttons = $('.btn-group').find($('button'));
    buttons.click(function(){
      activeData = $(this);
      if(activeData.hasClass('active')){
        console.log("already active...");
      } else {
        activeData.toggleClass('active').attr('aria-pressed', 'true')
        var sibling = activeData.siblings('.btn-default');
        sibling.removeClass('active').attr('aria-pressed', 'false');
        var dataType = activeData.attr("data-id");
      }
    })









  }

})