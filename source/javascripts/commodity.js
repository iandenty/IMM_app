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


    $('#year').change(function(){
      console.log($('#year').val())
      $('#output-year').val($('#year').val());
    })






  }

})