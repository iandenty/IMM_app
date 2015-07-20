$(function () { 
  if($('#chart1, #chart2').length){

    var chart1;
    var chart2;
    var year = 'year';

    var dataTypes = {
      value: {
        cartoSql: 'all_value_figures',
        unit: '1000 USD',
        lineChartID: '#chart1',
        donutChartID: '#chart2',
        chartData: {}
      },
      quantity: {
        cartoSql: 'all_quantity_figures',
        unit: '1000 RWE m3',
        chartID: '#chart1',
        lineChartID: '#chart1',
        donutChartID: '#chart2',
        chartData: {}
      }
    }

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
      legend: {
        item: {
          onmouseover: function(id) { 
            var $pieSegments = $('#chart2').find('.c3-chart-arc');
            $pieSegments.each(function(){
              var $this = $(this);
              if ($this.hasClass('c3-target-'+id+'')){
                $this.addClass('c3-focused');
              } else {
                $this.addClass('c3-defocused');
              }
            })
          },
          onmouseout: function(id) { 
            var $pieSegments = $('#chart2').find('.c3-chart-arc');
            $pieSegments.each(function(){
              $(this).removeClass('c3-defocused');
            })
          }
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
          label: 'hello'
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
        },
        onmouseover: function(id) { 
          var $chartLines = $('#chart1').find('.c3-chart-line');
          var $legendItem = $('#chart1').find('.c3-legend-item');
          var chartTitle = $('#chart2 .c3-chart-arcs-title').text();
          $chartLines.each(function(){
            var $this = $(this);
            if ($this.hasClass('c3-target-'+id.name+'')){
              $this.addClass('c3-focused');
            } else {
              $this.addClass('c3-defocused');
            }
          })
          $legendItem.each(function(){
            var $this = $(this);
            if (!$this.hasClass('c3-legend-item-'+id.name+'')){
              $this.css('opacity', '0.3');
            }
          })
          var ticks = $('#chart1 .c3-axis.c3-axis-x .tick tspan');
          var ticksArray = [];
          ticks.each(function(){
            ticksArray.push($(this).text());
          })
          ticksArray.sort();
          var tickIndex = $.inArray(chartTitle, ticksArray);
          $($('.c3-shapes-'+id.name+'.c3-circles-'+id.name+' .c3-circle')[tickIndex]).addClass("_expanded_").attr("r", "7");
        },
        onmouseout: function(id) { 
          $('.c3-shapes-'+id.name+'.c3-circles-'+id.name+' .c3-circle').removeClass("_expanded_").attr("r", "2.5");
          var $chartLines = $('#chart1').find('.c3-chart-line');
          var $legendItem = $('#chart1').find('.c3-legend-item');
          $chartLines.each(function(){
            $(this).removeClass('c3-defocused');
          })
          $legendItem.each(function(){
            var $this = $(this);
            if (!$this.hasClass('c3-legend-item-'+id.name+'')){
              $this.css('opacity', '1');
            }
          })
        }
      },
      donut: {
        title: "",
      },
      legend: {
              show: false

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

    //Set default state
    var activeData = $('.btn-group').find($('.btn[data-id="quantity"]'));
    activeData.attr('aria-pressed', 'true');
    activeData.addClass('active');
    // setData();

    var buttons = $('.btn-group').find($('button'));
    buttons.click(function(){
      activeData = $(this);
      if(activeData.hasClass('active')){
        console.log("already active...");
      } else {
        activeData.toggleClass('active').attr('aria-pressed', 'true')
        var sibling = activeData.siblings('.btn-default');
        sibling.removeClass('active').attr('aria-pressed', 'false');
        var dataType = activeData.attr("data-id");
        chartDetails.data.columns = [];
        setData(dataType);
      }
    })

    getLabels(dataTypes.quantity.cartoSql);

    function setData(dataType){
      setTimeout(function() {
        chart1.load({
          unload: chart1.columns
        })
        chart2.load({
          unload: chart2.columns
        })

      }, 200);

      setTimeout(function() {
        getLabels(dataTypes[dataType].cartoSql);
        $('#chart2 .c3-chart-arcs-title').hide();
      }, 500);
    }

    function getLabels(dataSet){
      labels = [];
      sql.execute("SELECT DISTINCT year FROM "+dataSet+"")
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
        getDataFields(dataSet);
    }

    // Get distinct dataFields
    function getDataFields(dataSet){
      var chartType = "area-spline";
      dataFields = [];
      sql.execute("SELECT DISTINCT product_group FROM "+dataSet+"")
        .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          dataFields.push(data.rows[i].product_group);
        }
        for (var i = 0; i < dataFields.length; i++) {
          hexColors = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728'];
          chartDetails.data.colors[dataFields[i]] = hexColors[i];
          defaultDonut.data.colors[dataFields[i]] = hexColors[i];
          chartDetails.data.types[dataFields[i]] = chartType;
          // getData(dataFields[i], dataSet);
          dataRequest(dataFields[i]);
        }
      });
      function dataRequest(dataField){
        chartDetails.columns = [];
        allDataForField = [];
        var allDataForField = [dataField];
        var sqlStatement = "SELECT amount " +
                         "FROM "+dataSet+"" +
                         " WHERE country_name ilike '%"+countryID.replace(/'/g, "''")+"%'  AND product_group='"+dataField+"'";
        sql.execute(sqlStatement)
        .done(function(data) {
          for (var i = 0; i < data.rows.length; i++) {
            allDataForField.push(data.rows[i].amount);
          }
         chartDetails.data.columns.unshift(allDataForField);

        })
      }
      loadCharts(dataSet);
    }


    function loadCharts(dataSet){

      if(dataSet===dataTypes.value.cartoSql){
        if($.isEmptyObject(dataTypes.value.chartData)){
          setTimeout(function() {

            chartDetails.axis.y.label = dataTypes.value.unit;
            dataTypes.value.chartData = chartDetails.data.columns;
            loadLineChart(dataTypes.value.chartData, dataTypes.value.unit);

          }, 1000);
        }
        else {
          loadLineChart(dataTypes.value.chartData, dataTypes.value.unit);
        }
      } 
      else if(dataSet===dataTypes.quantity.cartoSql){
        if($.isEmptyObject(dataTypes.quantity.chartData)){

          setTimeout(function() {

            chartDetails.axis.y.label = dataTypes.quantity.unit;
            dataTypes.quantity.chartData = chartDetails.data.columns;
            loadLineChart(chartDetails, dataTypes.quantity.unit);

          }, 1000);
        }
        else {
          loadLineChart(dataTypes.quantity.chartData, dataTypes.quantity.unit);
        }
      }


      function loadLineChart(chartData, axisLabel){

        if($('#chart1 svg').length===0){

          chart1 = c3.generate(chartData);
          loadPieChart(chartData);

        }
        else {
          donutDetails.columns.length = 0;
          console.log(JSON.stringify(defaultDonut.data.columns))
          chart1.axis.labels({y: axisLabel});
          chart1.load({
            columns: chartData
          });
          chart2.load({
            columns: defaultDonut.data.columns
          });
          mouseOverlay(chartData);
          $('#chart2 .c3-chart-arcs-title').hide();
        }

      }

      function loadPieChart(chartData){
        chart2 = c3.generate(defaultDonut);
        chart2.legend.hide('default1');


        mouseOverlay(chartData);

      }
    }


    function mouseOverlay(chartData){


      var rectangles = [].slice.call($('#chart1 svg').find('.c3-event-rect'));
      for (var i = 0; i < rectangles.length; i++) {
        appendRect(rectangles[i]);
      }

      $('.overlay').on({
        "mouseover": function() { 
          $('#chart2 .c3-chart-arcs-title').show();
          chart2.unload();

          indexArray = $(this).attr("data-id");
          intArrayIndex = (parseInt(indexArray) + 1);
          populatePie(intArrayIndex, chartData);

          setTimeout(function () {
            chart2.load(donutDetails);
          }, 300);

        },
        "mouseout":  function() { 
        }, 
        "click":  function() { 

          setTimeout(function () {
            chart2.unload();
          }, 200);

          indexArray = $(this).attr("data-id");
          intArrayIndex = (parseInt(indexArray) + 1);
          populatePie(intArrayIndex, chartData);

          setTimeout(function () {
            chart2.load(donutDetails);
          }, 500);

          $('.overlay').off("mouseover");

        }, 
      });

    }


    function appendRect(rectangle){
      classNames = d3.select(rectangle).attr("class");
      indexOfArrayNo = classNames.lastIndexOf("-");
      arrayNo = classNames.substring(indexOfArrayNo+1, classNames.length);
      width = rectangle.getBBox().width;
      height = rectangle.getBBox().height;
      $(rectangle).append('rect').attr({"class": "overlay", "data-id": arrayNo, "width": width , "height": height, "rx": "2", "ry": "2"});
    }

    function populatePie(intArrayIndex, chartData){
      donutDetails.columns.length = 0;
      var columnData;
      if("columns" in chartData){
        columnData = chartData.data.columns;
      }
      else {
        columnData = chartData;
      }


      for (var i = 0; i < columnData.length; i++) {
        var dataColumn = [];
        dataLabel = columnData[i][0];
        dataValue = columnData[i][intArrayIndex];
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

