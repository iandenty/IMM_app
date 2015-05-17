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
        },
        colors: {
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y'
          }
        },
        y: {
          label: '1000 m3 RWE'
        }
      }
    }

    var defaultDonut = {
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
      donut: {
        title: "",
      }
    }

    var donutDetails = {
      columns: [
      ],
      type: 'donut',
      donut: {
          title: ""
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
          hexColors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728'];
          chartDetails.data.colors[dataFields[i]] = hexColors[i];
          defaultDonut.data.colors[dataFields[i]] = hexColors[i];
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
      var chart1 = c3.generate(chartDetails);
      var chart2 = c3.generate(defaultDonut);
      chart2.legend.hide('default1');

      var rectangles = [].slice.call($('#chart1 svg').find('.c3-event-rect'));
      for (var i = 0; i < rectangles.length; i++) {
        appendRect(rectangles[i]);
      }

      $('.overlay').on({
        "mouseover": function() { 

          setTimeout(function () {
            chart2.unload();
          }, 500);

          indexArray = $(this).attr("data-id");
          intArrayIndex = (parseInt(indexArray) + 1);
          populatePie(intArrayIndex);

          setTimeout(function () {
            chart2.load(donutDetails);
          }, 800);

        },
        "mouseout":  function() { 
        }, 
        "click":  function() { 

          setTimeout(function () {
            chart2.unload();
          }, 500);

          indexArray = $(this).attr("data-id");
          intArrayIndex = (parseInt(indexArray) + 1);
          populatePie(intArrayIndex);

          setTimeout(function () {
            chart2.load(donutDetails);
          }, 800);

          $('.overlay').off("mouseover");

        }, 
      });

    }, 1000);


    function appendRect(rectangle){
      classNames = d3.select(rectangle).attr("class");
      indexOfArrayNo = classNames.lastIndexOf("-");
      arrayNo = classNames.substring(indexOfArrayNo+1, classNames.length);
      width = rectangle.getBBox().width;
      height = rectangle.getBBox().height;
      $(rectangle).append('rect').attr({"class": "overlay", "data-id": arrayNo, "width": width , "height": height, "rx": "2", "ry": "2"});
    }

    function populatePie(intArrayIndex){
      donutDetails.columns.length = 0;
      for (var i = 0; i < chartDetails.data.columns.length; i++) {
        var dataColumn = [];
        dataLabel = chartDetails.data.columns[i][0];
        dataValue = chartDetails.data.columns[i][intArrayIndex];
        if(dataLabel !== year) {
          dataColumn.push(dataLabel, dataValue);
        } else {
          $('.c3-chart-arcs-title').text(dataValue);
        }
        if(dataColumn.length > 0){
          donutDetails.columns.push(dataColumn);
        }
      }
    }

  }
});

