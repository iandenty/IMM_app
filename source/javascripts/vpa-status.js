$(function () { 
  if($('.main #map').length > 0){ 

    cartodb.createVis('map', 'http://iandenty.cartodb.com/api/v2/viz/e1ff5c5c-dad1-11e4-965d-0e0c41326911/viz.json')
      .done(function(vis, layers) {
        // layer 0 is the base layer, layer 1 is cartodb layer
        // when setInteraction is disabled featureOver is triggered
        layers[1].setInteraction(true);
        layers[1].on('featureClick', function(e, latlng, pos, data, layerNumber) {
          console.log(data);
          var vpaStatus = data["vpa_status"].toLowerCase().replace(/-/g, "");
          var countryName = data["country_name"].toLowerCase().replace(/\s+/g, "-");
          window.location = "countries/"+vpaStatus+"/"+countryName+"/"
          console.log(vpaStatus, countryName);
        });
        layers[1].on('featureOver', function(e, latlng, pos, data, layerNumber) {
          $('#map').css('cursor', 'pointer');
        });

        // you can get the native map to work with it
        var map = vis.getNativeMap();

        // now, perform any operations you need, e.g. assuming map is a L.Map object:
        map.setZoom(2);
        map.panTo([0, 0]);
      });

  }


  setTimeout(function(){ 
    $(".leaflet-control-attribution").add(".cartodb-logo").hide();
   }, 300);



})