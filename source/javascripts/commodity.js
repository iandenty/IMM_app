$(function() {

  if($('.commodity #map').length > 0){ 

    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    var map = L.map('map', {
        scrollWheelZoom: false,
        center: [0, 0],
        zoom: 2
    })

  

    map.addLayer(layer);

    //update output from slider
    $('#year').change(function(){
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

    var sql = new cartodb.SQL({ user: 'iandenty', format: 'geojson'  });


    
    // var  = L.geoJson().addTo(map);
    var vpaLayer = {
      "pre-negotiations" : L.geoJson(),
      "negotiation" : L.geoJson(),
      "preparation" : L.geoJson(),
      "implementation" : L.geoJson(),
    }

    getVpa();

    var countryLayerGroup = new L.LayerGroup();

    // L.control.layers(countryLayerGroup).addTo(map)
    var vpaCss = $("#vpa-css").text();
    // countryLayerGroup.setCartoCSS();

    $('#commodity-form').submit(function(event){
      var values = $(this).serializeArray();
      event.preventDefault();

      var activeCountries = [];

      for(var i = 0; i < values.length; i++){
        var name = values[i].name.toLowerCase()
        var value = values[i].value.toLowerCase()
        switch (name) {
          case "vpa-status":
            activeCountries.push(value);
            break;
          case "commodity":
            console.log(value);
            break;
          case "year":
            console.log(value);
            break;   
        }
      }
      updateCountries(activeCountries);

    })


    function updateCountries(activeCountries){
      countryLayerGroup.clearLayers();
      for(var i = 0; i < activeCountries.length; i++){

        if(vpaLayer.hasOwnProperty(activeCountries[i])) {
          countryLayerGroup.addLayer(vpaLayer[activeCountries[i]])
        }

      }
      countryLayerGroup.addTo(map)
    }


    function getVpa(){
      var vpaCountryTable = 'country_iso_only_1';
      var sqlStatement = "SELECT * " +
                           "FROM "+vpaCountryTable+"";
      sql.execute(sqlStatement)
      .done(function(geojson) {
        for(var i = 0; i < geojson.features.length; i++){
          vpaStatus = geojson.features[i].properties.vpa_status.toLowerCase();
          switch (vpaStatus) {
            case "pre-negotiations":
              vpaLayer["pre-negotiations"].addData(geojson.features[i]);
              break;
            case "negotiation":
              vpaLayer["negotiation"].addData(geojson.features[i]);
              break;
            case "preparation":
              vpaLayer["preparation"].addData(geojson.features[i]);
              break;
            case "implementation":
              vpaLayer["implementation"].addData(geojson.features[i]);
              break;
          }
        }
      })
    }






  }

})