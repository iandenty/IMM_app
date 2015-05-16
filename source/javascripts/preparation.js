$(function () { 
  if($('#container').length > 0){
    // var startYear;
    var dataFields = [],
        dataStructure = {},
        series = [],
        labels = [];

    //Key for Cartodb account
    var sql = new cartodb.SQL({ user: 'iandenty' });

    //Assign country name
    var countryID = document.getElementById("container").getAttribute("data-id");

    //Get labels
    function getLabels(){
      sql.execute("SELECT DISTINCT year FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          labels.push(data.rows[i].year);
        }
        labels.sort();
        getDataFields();
      }); 
    }

    // Get distinct dataFields
    function getDataFields(){
      sql.execute("SELECT DISTINCT product_group FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          dataFields.push(data.rows[i].product_group);
        }
        for (var i = 0; i < dataFields.length; i++) {
          getData(dataFields[i]);
        }
      });
    }

    function getData(dataField){
      var allDataForField = [];
      sql.execute("SELECT amount FROM all_quantity_figures where country_name='"+countryID+"' AND product_group='"+dataField+"'").done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          allDataForField.push(data.rows[i].amount);
        }
        function populateDataObject(dataField, allDataForField){
          dataStructure = {
            name: dataField,
            data: []
          };
          for (var i = 0; i < allDataForField.length; i++) {
            dataStructure.data.push(allDataForField[i]);
          }
        }
        populateDataObject(dataField, allDataForField);
        allDataForField.length = 0;
        series.push(dataStructure);
      })
    }

    // $.when(getLabels()).then(function(){

    //     console.log(labels);

    //     $('#container').highcharts({
    //       chart: {
    //           type: 'areaspline'
    //       },
    //       title: {
    //           text: countryID
    //       },
    //       xAxis: {
    //           categories: labels
    //       },
    //       yAxis: {
    //           title: {
    //               text: 'metric tonnes'
    //           }
    //       },
    //       series: series
    //   });
    // })
  
  }
});



// var highchart = { 
//   chart: {
//     type: 'areaspline'
//     },
//     title: {
//     text: countryID
//     },
//     xAxis: {
//     categories: labels
//     },
//     yAxis: {
//     title: {
//       text: 'Tonnes'
//       },
//       min: 0
//     },
//     series: series,
//     yAxis: {
//       min: 0
//     }
//   }
// }
