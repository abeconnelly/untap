
function bargraph_grouped(graph_id, DATA, label, title) {

  var margin = {top: 30, right: 40, bottom: 280, left: 50},
      width = 900 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

  var x0 = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
      .range([height, 0]);

  var tdata = transform_data(DATA);
  var xNames_tmp = d3.keys(tdata[0]).filter(function(key) { return key !== "x"; });
  var seq = color_palette(xNames_tmp.length);

  var color = d3.scale.ordinal().range(seq);

  var xAxis = d3.svg.axis()
      .scale(x0)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  //d3.select("svg").remove();
  d3.select("#" + graph_id).select("svg").remove();

  var svg = d3.select("#" + graph_id).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bargraph_load = function(data, y_label) {
    y_label = ( (typeof y_label === "undefined") ? "y-label" : y_label );

    var xNames = d3.keys(data[0]).filter(function(key) { return key !== "x"; });

    data.forEach(function(d) {
      d.ys = xNames.map(function(name) { return {name: name, value: +d[name]}; });
    });

    x0.domain(data.map(function(d) { return d.x; }));
    x1.domain(xNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ys, function(d) { return d.value; }); })]);

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
function plot_survey_bargraph_grouped(graph_id, query_json, title) {

  var primary_field = query_json.primary;
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
    if (i>0) {
      query.push( ", sum( p1.phenotype = '" + sec_group[i] + "') y" + i);
      group_label[ "y" + i ] = sec_group[i];
    } else {
      query.push( ", sum( p1.phenotype = '" + sec_group[i] + "') y");
      group_label[ "y" ] = sec_group[i];
    }
  }
  query.push("from survey p0, survey p1 where p0.phenotype_category = 'Participant_Survey:" + primary_field + "' and p0.human_id = p1.human_id and p1.phenotype_category = 'Participant_Survey:" + secondary_field + "' group by x");

  //DEBUG
  console.log(">>>", query.join(""));

  var q = query.join(" ");


  var sql_data = g_db.exec(query.join(" "))
  var xyy = format_sqlite_result(sql_data, group_label);
  bargraph_grouped(graph_id, xyy, "Frequency", title);
}


function plot_race_bloodtype_grouped_bargraph(graph_id) {
  var bloodtype = [ "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-" ];
  var query = ["select p.race x" ];
  var group_label = {};
  for (var i=0; i<bloodtype.length; i++) {
    query.push( ", sum( p.blood_type = '" + bloodtype[i] + "') y" + i );
    group_label[ "y" + i ] = bloodtype[i];
  }

  // The 'Caucasian (White)' category I don't think is used.  There is a 'White' category
  // instead?
  //
  query.push("from demographics p where race != '' and race != 'Caucasian (White)' group by x");

  var sql_data = g_db.exec(query.join(" "))
  var xyy = format_sqlite_result(sql_data, group_label);
  bargraph_grouped(graph_id, xyy, "Frequency", "Bloodtype by Race");
}
