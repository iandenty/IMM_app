// window.onload = function () {

//     // Instantiate new map object, place it in 'map' element
//     var map_object = new L.Map('map', {
//         center: [0,0],
//         zoom: 2
//     });

//     var vpaStyling = '#country_iso_only_1 {' +
//                         'polygon-opacity: 0.7;'+
//                         'line-color: #FFF;'+
//                         'line-width: 1;'+
//                         'line-opacity: 1;}'+
//                         '#country_iso_only_1[vpa_status="Pre-negotiations"] { polygon-fill: #A6CEE3;}'+
//                         '#country_iso_only_1[vpa_status="Negotiation"] { polygon-fill: #1F78B4;}' +
//                         '#country_iso_only_1[vpa_status="Implementation"] {polygon-fill: #33a02c;}'+
//                         '#country_iso_only_1[vpa_status="Preparation"] {polygon-fill: #b2df8a;}'

//     // Put layer data into a JS object
//     var layerSource = {
//             user_name: 'iandenty',
//             type: 'cartodb',
//             sublayers: [{
//                 sql: "SELECT * FROM country_iso_only_1", // African countries
//                 cartocss: vpaStyling
//         }]
//     }

//     // For storing the sublayers
//     var sublayers = [];

//     // Pull tiles from OpenStreetMap
//     L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
//     }).addTo(map_object);

//     // Add data layer to your map
//     cartodb.createLayer(map_object,layerSource, {legends: true})
//         .addTo(map_object)
//         .done(function(layer) {
//            for (var i = 0; i < layer.getSubLayerCount(); i++) {
//                sublayers[i] = layer.getSubLayer(i);
//                console.log(sublayers[i]);
//            } 
//         })
//         .error(function(err) {
//             console.log("error: " + err);
//         });
//     }