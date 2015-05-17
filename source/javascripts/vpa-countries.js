// window.onload = function() {
//     if ($('#map').length > 0) {
//       var vizjson = 'http://iandenty.cartodb.com/api/v2/viz/e1ff5c5c-dad1-11e4-965d-0e0c41326911/viz.json';

//       // Choose center and zoom level
//       var options = {
//           center: [0,0],
//           zoom: 2
//       }

//       // Instantiate map on specified DOM element
//       var map_object = new L.Map('map', options);

//       // Add a basemap to the map object just created
//       L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
//           attribution: 'Stamen'
//       }).addTo(map_object);

//       // Add CartoDB data layers
//       cartodb.createLayer(map_object,vizjson)
//           .addTo(map_object);


//     // var sql = new cartodb.SQL({ user: 'iandenty' });
//     // var country_names = [];
//     // sql.execute("SELECT DISTINCT country_name FROM country_iso_only_1 where vpa_status='Implementation'")
//     //   .done(function(data) {
//     //   for (var i = 0; i < data.rows.length; i++) {
//     //      country_names.push(data.rows[i].country_name);
//     //   }
//     // country_names.sort();
//     // console.log(country_names);
//     // });

//   }
// }

