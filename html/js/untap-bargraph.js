

function bargraph(DATA, label, alt_label, title) {

  var margin = {top: 30, right: 40, bottom: 280, left: 50},
      width = 900 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var y1 = d3.scale.linear()
      .range([height, 0.0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var y1Axis = d3.svg.axis()
      .scale(y1)
      .orient("right")
      .ticks(10);

  d3.select("svg").remove();
  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bargraph_type = function type(d) { d.y = +d.y; return d; };

  var bargraph_load = function(data, y_label, y1_label) {

    y_label = ( (typeof y_label === "undefined") ? "y-label" : y_label );

    var show_y1_label = false;
    if (typeof y1_label !== "undefined") { show_y1_label = true; }

    x.domain(data.map(function(d) { return d.x; }));
    //x.domain(data.map(function(d) { if ((typeof d.x === "undefined") || (d.x=="")) { return "(none specified)"; }  return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    var y0max = d3.max(data, function(d) { return d.y; });
    var y0sum = d3.sum(data, function(d) { return d.y; });

    if (show_y1_label) {
      y1.domain([0, y0max/y0sum]);
    }

    if (typeof title !== "undefined") {
      svg.append("text")
        .attr("x", (width/2))
        .attr("y", 0 - (margin.top/2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title)
    }

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) { return "rotate(-65)"});

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(-10)")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(y_label);

    if (show_y1_label) {
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (width+10) + ")")
          .call(y1Axis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -16)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(y1_label);
    }


    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });


    //WIP
    /*
    var zoom = d3.behavior.zoom()
      .scaleExtent([1,1])
      .x(x);

    // http://computationallyendowed.com/blog/2013/01/21/bounded-panning-in-d3.html
    zoom.on('zoom', function() {
      var t= zoom.translate();
      var tx = t[0];
      var ty = t[1];
      tx = Math.min(tx, 0);
      tx = Mat.max(tx, width-max);
      svg.select('.data').attr('d', line);
    });
    svg.call(zoom);
    */


  };



  bargraph_load(transform_data(DATA), label, alt_label);

}

function plot_simple_bargraph(table, field, limit, title) {
  var limit_str = "";
  if (typeof limit !== "undefined") { limit_str = " limit " + limit ; }
  var sql_data = g_db.exec("select count(human_id) y, " + field + " x from " + table + " group by x order by y desc  " + limit_str );
  var xy = format_sqlite_result(sql_data);

  for (var i=1; i<xy.length; i++) {
    if (xy[i][1]=="") { xy[i][1] = "(non specified)"; }
  }

  bargraph(xy, "Frequency", undefined, title);
}

function plot_survey_bargraph(field, title) {
  var sql_data = g_db.exec("select count(human_id) y, phenotype x from survey where phenotype_category = 'Participant_Survey:" + field + "' group by x order by x");
  var xy = format_sqlite_result(sql_data);

  for (var i=1; i<xy.length; i++) {
    if (xy[i][1]=="") { xy[i][1] = "(non specified)"; }
  }

  bargraph(xy, "Frequency", "Percentage", title);
}

function plot_uploaded_data_summary() {
  var sql_data = g_db.exec("select count(human_id) y, data_type x from uploaded_data group by data_type order by y desc");
  var xy_raw = format_sqlite_result(sql_data);
  var xy_filtered = [];
  xy_filtered.push(xy_raw[0]);
  for (var i=0; i<xy_raw.length; i++) {
    if (xy_raw[i][0] > 1) {
      xy_filtered.push(xy_raw[i]);
    }
  }
  bargraph(xy_filtered, "Frequency", "Percentage", "Uploaded Data");
}

