$(function() {

	if($('.commodity #map').length > 0){ 

		// ****form behaviour****

		//update output from slider
		$('#year').change(function(){
			$('#output-year').val($('#year').val());
		})

		// ****Map logic****

		var map = L.map('map', {
				scrollWheelZoom: true,
				center: [0, 0],
				zoom: 2,
				infowindow: true,
				tooltip: true
		})

		var layerSource = {
			user_name: 'iandenty',
			type: 'cartodb',
			sublayers: []
		}

		var LayerActions = {
			country: function(){

			},
			quantity: function(){

			},
			value: function(){
			}
		}

		var sublayers = [];
		var countryLayer = [];
		var valueLayer = [];
		var quantityLayer = [];

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
		var vpaCss = $('#vpa-css').text();
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

			// Get country information
			var dataBase;
			var vpaCountries = activeCountries.join("','");
			updateCountries(vpaCountries);

			//Get commodity information
			if(dataSet == "value"){
				dataBase = 'all_value_figures';
				updateCommodity(commodity, year, vpaCountries, dataBase);
			}
			else if(dataSet == "quantity"){
				dataBase = 'all_quantity_figures';
				updateCommodity(commodity, year, vpaCountries, dataBase);
			}

		})


		//add countries to layerSource OR set SQL
		function updateCountries(vpaCountries){
			if(countryLayer.length === 0){

				var layerContent = {
					sql: "SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')",
					cartocss: vpaCss
				}
				layerSource.sublayers.push(layerContent);
				// loadMap(countryLayer);
				cartodb.createLayer(map,layerSource).addTo(map).done(function(layer) {
					sublayer = layer.getSubLayer(0);
					countryLayer.push(sublayer);
				})
			}
			else {
				countryLayer[0].setSQL("SELECT * FROM country_iso_only_1 WHERE vpa_status IN('"+vpaCountries+"')");
			}
		}

		//get commodity and year layer
		function updateCommodity(commodity, year, vpaCountries, dataBase){
			if(dataBase.indexOf("quantity") >= 0){
				if(quantityLayer.length == 0){
					var layerContent = {
						sql: "SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')",
						cartocss: commodityCss
					}
					layerSource.sublayers.push(layerContent);
					loadMap(quantityLayer);
				}
				else {
					quantityLayer[0].setSQL("SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')");
					quantityLayer[0].setCartoCSS(commodityCss);
				}
			}
			else if(dataBase.indexOf("value") >= 0){
				if(valueLayer.length == 0){
					var layerContent = {
						sql: "SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')",
						cartocss: commodityCss
					}
					layerSource.sublayers.push(layerContent);
					loadMap(valueLayer);
				}
				else {
					valueLayer[0].setSQL("SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')");
				}
			}
		}
 
		// Add data layer to your map
		function loadMap(arrayLayers){
			cartodb.createLayer(map,layerSource)
				.addTo(map)
				.done(function(layer) {


					// working commodity code
					var num_sublayers = layer.getSubLayerCount();
					alert(num_sublayers)
					countrySublayer = layer.getSubLayer(0);
					sublayer = layer.getSubLayer(1);
					countryLayer.push(sublayer);
					arrayLayers.push(sublayer);
					console.log("quantity", quantityLayer);
					console.log("country", countryLayer);
					console.log("value", valueLayer);




					// layerSource.sublayers = [];


				})
				.error(function(err) {
						console.log("error: " + err);
				});
		}


	}

})