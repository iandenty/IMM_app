$(function() {

  if($('.commodity #map').length > 0){ 

    // ****form behaviour****

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

    // ****Map logic****

    var map = L.map('map', {
        scrollWheelZoom: false,
        center: [0, 0],
        zoom: 2
    })

    var layerSource = {
      user_name: 'iandenty',
      type: 'cartodb',
      sublayers: []
    }


    var sublayers = [];


    var baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    map.addLayer(baseLayer);


    var vpaCss = $("#vpa-css").text();

    $('#commodity-form').submit(function(event){
      var values = $(this).serializeArray();
      event.preventDefault();

      var activeCountries = [];
      var commodity;
      var year;

      for(var i = 0; i < values.length; i++){
        var name = values[i].name.toLowerCase();
        var value = values[i].value;
        switch (name) {
          case "vpa-status":
            activeCountries.push(value);
            break;
          case "commodity":
            commodity = value;
            break;
          case "year":
            year = value;
            break;   
        }
      }
      var vpaCountries = activeCountries.join("','");
      updateCountries(vpaCountries);
      updateCommodity(commodity, year, vpaCountries);


      setTimeout(function(){ 

        loadMap();

      }, 500);

    })


    //add countries to layerSource OR set SQL
    function updateCountries(vpaCountries){
      
      if(layerSource.sublayers.length === 0){

        var layerContent = {
          sql: "SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')",
          cartocss: $('#vpa-css').text()
        }

        layerSource.sublayers.push(layerContent);
        // loadMap();
      }
      else {
        sublayers[0].setSQL("SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')");
      }
 
    }

    //get commodity and year layer
    function updateCommodity(commodity, year, vpaCountries){

      console.log(commodity, year, vpaCountries)

      if(layerSource.sublayers.length < 2){



        var layerContent = {
          sql: "SELECT * FROM all_quantity_figures WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')",
          cartocss: $('#commodity-css').text()
        }

        layerSource.sublayers.push(layerContent);
        // loadMap();
      }
      else {
        sublayers[1].setSQL("SELECT * FROM all_quantity_figures WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')");
      }
    }
 
    // Add data layer to your map
    function loadMap(){

      cartodb.createLayer(map,layerSource)
        .addTo(map)
        .done(function(layer) {

         for (var i = 0; i < layer.getLayerCount(); i++) {
            sublayer = layer.getSubLayer(i);
            sublayers.push(sublayer);
         }

        })
        .error(function(err) {
            console.log("error: " + err);
        });
        
    }

    function removeLayers(){
      if(sublayers.length){

        for (var i = 0; i < sublayers.length; i++) {
           sublayers[i].toggle()
        }

      }

      // for (var i = 0; i < sublayers.length; i++) {
      //     sublayers[i].remove();
      // }
    }


  }

})