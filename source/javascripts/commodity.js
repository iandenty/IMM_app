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
				center: [0, 60],
				zoom: 2,
				infowindow: true,
				tooltip: true,
				cartodb_logo: false,
				legends: true
		})

		var layerSource = {
			user_name: 'iandenty',
			type: 'cartodb',
			sublayers: []
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
			var dataset;

			for(var i = 0; i < values.length; i++){
				var name = values[i].name.toLowerCase();
				var value = values[i].value;
				switch (name) {
					case "dataset":
						dataset = value;
						break;					
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
			var vpaCountries = activeCountries.join("','");
			updateCountries(vpaCountries);
			//Get commodity information
			if(dataset == "value"){
				if(quantityLayer.length > 0){
					quantityLayer[0].setSQL("SELECT * FROM all_quantity_figures WHERE product_group ilike '%null%'");
				}
				dataBase = 'all_value_figures';
				updateCommodity(commodity, year, vpaCountries, dataBase);
			}
			else if(dataset == "quantity"){
				if(valueLayer.length > 0){
					valueLayer[0].setSQL("SELECT * FROM all_quantity_figures WHERE product_group ilike '%null%'");
				}
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
				cartodb.createLayer(map,layerSource).addTo(map).done(function(layer) {
					sublayer = layer.getSubLayer(0);
					countryLayer.push(sublayer);
					countryLayer[0].set(layerSource);
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

					cartodb.createLayer(map,layerSource).addTo(map).done(function(layer) {

						lastLayer = layer.getSubLayerCount() - 1;
						sublayer = layer.getSubLayer(lastLayer);
						quantityLayer.push(sublayer);

					})
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

					cartodb.createLayer(map,layerSource).addTo(map).done(function(layer) {
						lastLayer = layer.getSubLayerCount() - 1;
						sublayer = layer.getSubLayer(lastLayer);
						valueLayer.push(sublayer);
					})
				}
				else {
					quantityLayer = [];
					valueLayer[0].setSQL("SELECT * FROM "+dataBase+" WHERE product_group ilike '%"+commodity+"%' AND year='"+year+"' AND vpa_status IN('"+vpaCountries+"')");
					valueLayer[0].setCartoCSS(commodityCss);
				}
			}
		}


	}

})