$(function () { 
  if($('#chart1').length > 0){
    
    var year = 'year';
    var chartDetails = {
      bindto: '#chart1',
      data: {
        x: year,
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
    var countryID = document.getElementById("chart1").getAttribute("data-id");

    //Get labels
    function getLabels(){
      labels = [];
      // labels.push(year);
      sql.execute("SELECT DISTINCT year FROM all_quantity_figures")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          labels.push((data.rows[i].year).toString());
        }
        labels.sort();
        chartDetails.axis.x.tick['values'] = labels;
        labels.unshift(year);
        tickLabels = labels.slice(1, -1);
        chartDetails.axis.x.tick['values'] = tickLabels;
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
      var rectangles = [].slice.call($('#chart1 svg').find('.c3-event-rect'));

      for (var i = 0; i < rectangles.length; i++) {
        appendRect(rectangles[i]);
      }
    }, 1000);

    // Chart2
    var chart = c3.generate({
        bindto: '#chart2',
        data: {
          columns: [
              ['default1', 100]
          ],
          type : 'donut',
          colors: {
            default1: '#e2e2e3'
          }
        },
        legend: {
          show: false
        },
        donut: {
            title: "",
            label: {
              show: false
            }
        },
        tooltip: {
            show: false
        }
    });

  function appendRect(rectangle){
    classNames = d3.select(rectangle).attr("class");
    indexOfArrayNo = classNames.lastIndexOf("-");
    arrayNo = classNames.substring(indexOfArrayNo+1, classNames.length);
    width = rectangle.getBBox().width;
    height = rectangle.getBBox().height;
    $(rectangle).append('rect').attr({"class": "overlay", "data-id": arrayNo, "width": width , "height": height, "rx": "2", "ry": "2"})
    .on({
      "mouseover": function() { 

       },
      "mouseout":  function() { /* do stuff */ }, 
      "click":  function() { 

       }, 
    });
  }

  function populatePie(){
    
  }


      
  }
});

