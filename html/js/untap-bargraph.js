

function bargraph(DATA, label) {

  //var margin = {top: 20, right: 20, bottom: 30, left: 40},
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
      //.ticks(10, "%");

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

  //var bargraph_type = function type(d) { d.frequency = +d.frequency; return d; };
  var bargraph_type = function type(d) { d.y = +d.y; return d; };

  var bargraph_load = function(data, y_label, y1_label) {

    y_label = ( (typeof y_label === "undefined") ? "y-label" : y_label );
    y1_label = ( (typeof y1_label === "undefined") ? "Percentage" : y1_label );

    x.domain(data.map(function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    var y0max = d3.max(data, function(d) { return d.y; });
    var y0sum = d3.sum(data, function(d) { return d.y; });

    y1.domain([0, y0max/y0sum]);

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


    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

  };
  bargraph_load(transform_data(DATA), label);

}

function plot_survey_bargraph(field) {
  var sql_data = g_db.exec("select count(human_id) y, phenotype x from survey where phenotype_category = 'Participant_Survey:" + field + "' group by x order by x");
  var xy = format_sqlite_result(sql_data);
  bargraph(xy, "Frequency");
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
  bargraph(xy_filtered, "Frequency");
}

