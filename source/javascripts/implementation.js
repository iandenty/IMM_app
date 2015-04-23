$(function() {
  //Key for Cartodb account
  var sql = new cartodb.SQL({ user: 'iandenty' });

  //Data variables
  var colors = ['220,220,220', '151,187,205'];
  var dataFields = [];
  var chartData = {
      labels: [],
      datasets: []
  };
  var allDataForField = [];
  var ctx = document.getElementById("bar-chart").getContext("2d");
  var dataTest = {"labels":[2004,2005,2006,2007,2008,2009,2010,2011,2012,2013],"datasets":[{"labels":"Wood","fillColor":"rgba(220,220,220,0.2)","strokeColor":"rgba(220,220,220,1)","pointColor":"rgba(220,220,220,1)","pointStrokeColor":"#fff","pointHighlightFill":"#fff","pointHighlightStroke":"rgba(220,220,220,1)","data":[2613.1,2562.9,2194.5,1792,1632.8,1230.6,1312.1,1213.8,988.4,901.4]},{"labels":"Pulp","fillColor":"rgba(220,220,220,0.2)","strokeColor":"rgba(220,220,220,1)","pointColor":"rgba(220,220,220,1)","pointStrokeColor":"#fff","pointHighlightFill":"#fff","pointHighlightStroke":"rgba(220,220,220,1)","data":[303.9,306.9,253.1,244.3,149.7,73.6,90.1,70.7,40.9,19.1]},{"labels":"Paper","fillColor":"rgba(220,220,220,0.2)","strokeColor":"rgba(220,220,220,1)","pointColor":"rgba(220,220,220,1)","pointStrokeColor":"#fff","pointHighlightFill":"#fff","pointHighlightStroke":"rgba(220,220,220,1)","data":[158,128.4,129.9,216.5,201.3,260,193.4,195.4,136.4,167.6]},{"labels":"Furniture","fillColor":"rgba(220,220,220,0.2)","strokeColor":"rgba(220,220,220,1)","pointColor":"rgba(220,220,220,1)","pointStrokeColor":"#fff","pointHighlightFill":"#fff","pointHighlightStroke":"rgba(220,220,220,1)","data":[678.3,660.2,631.2,658.7,538.6,453.7,458.1,368.5,364.1,296.7]}]};

  //Find bar chart and action
  if ($('#bar-chart').length > 0) {

    //Assign country name
    var countryID = document.getElementById("bar-chart").getAttribute("data-id");
    
    //Get labels
    function getLabels(){
      sql.execute("SELECT DISTINCT year FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          chartData.labels.push(data.rows[i].year);
        }
        chartData.labels.sort();
      });  
    }

    getLabels();
    getDataFields(chartData)


    // Get distinct dataFields
    function getDataFields(chartData){
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
      allDataForField = [];
      sql.execute("SELECT amount FROM all_quantity_figures where country_name='"+countryID+"' AND product_group='"+dataField+"'").done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          allDataForField.push(data.rows[i].amount);
        }
        //create dataset
        function populateDataObject(dataField, allDataForField){
          dataStructure = {};
          dataStructure = {
            labels: dataField,
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: []
          };
          for (var i = 0; i < allDataForField.length; i++) {
            dataStructure.data.push(allDataForField[i]);
          }
          chartData.datasets.push(dataStructure);
          // console.log(JSON.stringify(chartData));
          var data = chartData;
          console.log(data)
          var myLineChart = new Chart(ctx).Line(data, options);
        }
        populateDataObject(dataField, allDataForField);
        allDataForField.length = 0;
      })
    }
  }

  var options = {

      ///Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,

      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.05)",

      //Number - Width of the grid lines
      scaleGridLineWidth : 1,

      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,

      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,

      //Boolean - Whether the line is curved between points
      bezierCurve : true,

      //Number - Tension of the bezier curve between points
      bezierCurveTension : 0.4,

      //Boolean - Whether to show a dot for each point
      pointDot : true,

      //Number - Radius of each point dot in pixels
      pointDotRadius : 4,

      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,

      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,

      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,

      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,

      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

  };

});