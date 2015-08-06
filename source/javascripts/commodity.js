$(function() {

  if($('.commodity #map').length > 0){ 

    // ****form behaviour****

    //update output from slider
    $('#year').change(function(){
      $('#output-year').val($('#year').val());
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
    var countryLayer = [];
    var valueLayers = [];
    var quantityLayers = [];

    var baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',{
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    map.addLayer(baseLayer);

    //Set default state
    var activeData = $('.btn-group').find($('.btn[data-id="quantity"]'));
    activeData.attr('aria-pressed', 'true');
    activeData.addClass('active');
    var dataSet = activeData.attr("data-id");

    // Set dataset

    var buttons = $('.btn-group').find($('button'));
    buttons.click(function(){
      activeData = $(this);
      if(activeData.hasClass('active')){
        console.log("already active...");
      } else {
        activeData.toggleClass('active').attr('aria-pressed', 'true')
        var sibling = activeData.siblings('.btn-default');
        sibling.removeClass('active').attr('aria-pressed', 'false');
        dataSet = activeData.attr("data-id");
      }
    })    

    // Set cartoCSS styling
    var vpaCss = $("#vpa-css").text();
    var commodityCss = $('#commodity-css').text();

    //Get input values
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
      var dataBase;
      var vpaCountries = activeCountries.join("','");
      updateCountries(vpaCountries);
      if(dataSet == "value"){
        dataBase = 'all_value_figures';
        // updateCommodity(commodity, year, vpaCountries, dataBase);
      }
      else if(dataSet == "quantity"){
        dataBase = 'all_quantity_figures';
        // updateCommodity(commodity, year, vpaCountries, dataBase);
      }

    })


    //add countries to layerSource OR set SQL
    function updateCountries(vpaCountries){
      layerSource.sublayers = [];
      
      if(countryLayer.length === 0){

        var layerContent = {
          sql: "SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')",
          cartocss: vpaCss
        }
        layerSource.sublayers.push(layerContent);
      }
      else {
        countryLayer[0].setSQL("SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')");
      }
      loadMap("country")
 
    }

    //get commodity and year layer
    function updateCommodity(commodity, year, vpaCountries, dataBase){
      layerSource.sublayers = [];

      if(layerSource.sublayers.length == 1){

        var layerContent = {
          sql: "SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')",
          cartocss: commodityCss
        }
        layerSource.sublayers.push(layerContent);
        // loadMap();
      }
      else {
        sublayers[1].setSQL("SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')");
      }
    }
 
    // Add data layer to your map
    function loadMap(sublayerPot){
      console.log("sublayers:", sublayers)
      cartodb.createLayer(map,layerSource)
        .addTo(map)
        .done(function(layer) {

        sublayers = [];
        for (var i = 0; i < layer.getLayerCount(); i++) {
           sublayer = layer.getSubLayer(i);
           if(sublayerPot=="country"){
            countryLayer.push(sublayer);
           }
        }


        })
        .error(function(err) {
            console.log("error: " + err);
        });
        
    }


  }

})