
function bargraph_grouped(DATA, label) {

  var margin = {top: 30, right: 40, bottom: 280, left: 50},
      width = 900 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  d3.select("svg").remove();
  var svg = d3.select("#graph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bargraph_load = function(data, y_label) {
    y_label = ( (typeof y_label === "undefined") ? "y-label" : y_label );

    var xNames = d3.keys(data[0]).filter(function(key) { return key !== "x"; });

    console.log(xNames);

    data.forEach(function(d) {
      d.ys = xNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.x; }));
    x1.domain(xNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ys, function(d) { return d.value; }); })]);

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

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x0(d.x) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ys; })
      .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(xNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

  };
  bargraph_load(transform_data(DATA), label);

}


/*
  var margin = {top: 30, right: 40, bottom: 280, left: 50},
      width = 700 - margin.left - margin.right,
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
        .attr("transform", "translate(" + width + ")")
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
*/

// Example:
// {
//   "primary" : "Age",
//   "primary_restrict" : [],
//   "secondary" : "Sex/Gender",
//   "secondary_restrict" : [ "Male", "Female" ]
// }
function plot_survey_bargraph_grouped(query_json) {

  primary_field = query_json.primary;
  var prim_group = [];
  if (primary_field["primary_restrict"] && (primary_field["primary_restrict"].length>0)) {
    var prim_group_sql = g_db.exec("select distinct phenotype from survey where phenotype_category = 'Participant_Survey:" + primary_field + "' order by phenotype");
    if (prim_group_sql.length == 0) return;
    for (var i=0; i<prim_group_sql[0].values.length; i++) {
      prim_group.push(prim_group_sql[0].values[i][0]);
    }
    if (prim_group.length==0) return;
  } else {
    prim_group = query_json.primary_restrict;
  }

  secondary_field = query_json.secondary;
  var sec_group = [];
  if (secondary_field["secondary_restrict"] && (secondary_field["secondary_restrict"].length>0)) {
    var sec_group_sql = g_db.exec("select distinct phenotype from survey where phenotype_category = 'Participant_Survey:" + secondary_field + "' order by phenotype");
    if (sec_group_sql.length == 0) return;
    for (var i=0; i<sec_group_sql[0].values.length; i++) {
      sec_group.push(sec_group_sql[0].values[i][0]);
    }
    if (sec_group.length==0) return;
  } else {
    sec_group = query_json.secondary_restrict;
  }


  var group_label = {};
  var query = ["select p0.phenotype x"];
  for (var i=0; i<sec_group.length; i++) {
    query.push( ", sum( p1.phenotype = '" + sec_group[i] + "') y" + i);
    group_label[ "y" + i ] = sec_group[i];
  }
  query.push("from survey p0, survey p1 where p0.phenotype_category = 'Participant_Survey:" + primary_field + "' and p0.human_id = p1.human_id and p1.phenotype_category = 'Participant_Survey:" + secondary_field + "' group by x");

  var q = query.join(" ");


  var sql_data = g_db.exec(query.join(" "))
  var xyy = format_sqlite_result(sql_data, group_label);
  bargraph_grouped(xyy, "Frequency");
}

/*
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
  bargraph_grouped(xy_filtered, "Frequency");
}
*/
