$(function () { 
  if($('#chart1, #chart2, .btn-group').length){
    var chart1;
    var chart2;
    var year = 'year';

    var dataTypes = {
      value: {
        cartoSql: 'all_value_figures',
        unit: '1000 USD',
        chartData: {}
      },
      quantity: {
        cartoSql: 'all_quantity_figures',
        unit: '1000 RWE m3',
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
              console.log($(this))
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
        setData(dataType);
      }
    })

    getLabels(dataTypes.quantity.cartoSql);
    getDataFields(dataTypes.quantity.cartoSql);

    function setData(dataType){
      setTimeout(function() {
        chart1.unload();
        chart2.unload();
        // chart2.toggle();
        $('#chart2 .c3-chart-arcs-title').toggle();
      }, 200);

      setTimeout(function() {
        getLabels(dataTypes[dataType].cartoSql);
        getDataFields(dataTypes[dataType].cartoSql);
        $('#chart2 .c3-chart-arcs-title').toggle();
        chart2.toggle();
      }, 500);

      // if(activeData.attr("data-id") === "quantity") {
      //   if(typeof chart1 !== "undefined"){
      //     chart1.unload();
      //     chart2.unload();
      //     dataSet = dataTableQuantity;
      //     console.log(dataSet)
      //     getLabels(dataSet);
      //     getDataFields(dataSet);
      //   }
      //   var dataSet = "quantity";
      //   getLabels();
      //   getDataFields();
      // } else if(activeData.attr("data-id") === "value") {
      //   if(typeof chart1 !== "undefined"){
      //     chart1.unload();
      //     chart2.unload();
      //     dataSet = dataTableValue;
      //     console.log(dataSet)
      //     getLabels(dataSet);
      //     getDataFields(dataSet);
      //   }
      //   var dataSet = "value";
      //   getLabels(dataSet);
      //   getDataFields(dataSet);
      // }
    }

    //Get labels
    function getLabels(dataSet){
      labels = [];
      // labels.push(year);
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
    }

    // Get distinct dataFields
    function getDataFields(dataSet){
      var chartType = "area-spline";
      dataFields = [];
      console.log("SELECT DISTINCT product_group FROM "+dataSet+"")
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
          getData(dataFields[i], dataSet);
        }
      });
    }


    // '"+countryID+"'

   // var sqlStatement =  "SELECT amount " +
   //                     "FROM all_quantity_figures " +
   //                     "WHERE country_name = {{countryName}} AND product_group = {{productGroup}}";
   //  , {countryName: countryID, productGroup: dataField} "+countryID+"

    function getData(dataField, dataSet){
      // if(inputString.indexOf("'") > -1){

      // }
      // var cote = "Côte d''Ivoire"

      allDataForField = [];
      var allDataForField = [dataField];
      var sqlStatement = "SELECT amount " +
                       "FROM "+dataSet+"" +
                       " WHERE country_name='"+countryID.replace(/'/g, "''")+"'  AND product_group='"+dataField+"'";
                       console.log(sqlStatement)
      sql.execute(sqlStatement)
      .done(function(data) {
        for (var i = 0; i < data.rows.length; i++) {
          allDataForField.push(data.rows[i].amount);
        }
       chartDetails.data.columns.unshift(allDataForField);
      })
    }

    setTimeout(function () {
      console.log(chartDetails);
      console.log(defaultDonut);

      chart1 = c3.generate(chartDetails);
      chart2 = c3.generate(defaultDonut);
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

