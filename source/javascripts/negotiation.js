$(function () { 
  if($('#chart').length > 0){

    var chartDetails = {
      data: {
        x: 'year',
        xFormat: '%Y',
        columns: [
        ],
        types: {
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y'
          }
        }
      }
    }

    //Key for Cartodb account
    var sql = new cartodb.SQL({ user: 'iandenty' });

    //Assign country name
    var countryID = document.getElementById("chart").getAttribute("data-id");

    //Get labels
    function getLabels(){
      labels = [];
      labels.push('year');
      sql.execute("SELECT DISTINCT year FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          labels.push((data.rows[i].year).toString());
        }
        labels.sort();
        labelId = labels.pop();
        labels.unshift(labelId);
        console.log(labels);
        chartDetails.data.columns.unshift(labels);
      }); 
    }

    // Get distinct dataFields
    function getDataFields(){
      var chartType = "area-spline";
      dataFields = [];
      sql.execute("SELECT DISTINCT product_group FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          dataFields.push(data.rows[i].product_group);
        }
        for (var i = 0; i < dataFields.length; i++) {
          chartDetails.data.types[dataFields[i]] = chartType;
          getData(dataFields[i]);
        }
      });
    }

    function getData(dataField){
      allDataForField = [];
      var allDataForField = [dataField];
      sql.execute("SELECT amount FROM all_quantity_figures where country_name='"+countryID+"' AND product_group='"+dataField+"'").done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          allDataForField.push(data.rows[i].amount);
        }
       chartDetails.data.columns.unshift(allDataForField);
      })
    }

    getLabels();
    getDataFields();

    setTimeout(function () {
        var chart = c3.generate(chartDetails);
        console.log(JSON.stringify(chartDetails));
    }, 1000);
      
  }
});

