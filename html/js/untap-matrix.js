
function pathogenic_matrix_example(graph_id) {
  var q = " select id, json_record " +
      " from suff_record where " +
      " (json_record like '%pathogenic%,3,%High%Well-established%' or json_record like '%pathogenic%,4,%High%Well-established%' or json_record like '%pathogenic%,5,%High%Well-established%' or json_record like '%pathogenic%,6,%High%Well-established%' ) " +
      " limit 50";
  var r = g_db.exec(q);
  var col_data = format_sqlite_result(r);

  var rec_id_list = [];
  var col_label = [];
  var col_idx = {};
  var col_map = {};
  for (var i=1; i<col_data.length; i++) {
    var v = JSON.parse(col_data[i][1]);
    col_label.push(v[5] + ":" + v[8]);
    col_idx[col_data[i][0]] = col_label.length-1;
    col_map[col_data[i][0]] = v;
    rec_id_list.push(col_data[i][0]);
  }

  q = "select id, human_id from uploaded_data where ( name like '%CGI%' or name like '%23and%' ) and name not like '%master%'  order by human_id";
  r = g_db.exec(q);
  var row_data = format_sqlite_result(r);
  var row_label = [];
  var row_idx = {};
  for (var i=1; i<row_data.length; i++) {
    row_label.push(row_data[i][1] + ":" + row_data[i][0]);
    row_idx[row_data[i][0]] = row_label.length-1;
  }

  q = "select m.id id, " +
     "  u.human_id human_id, " +
     "  m.uploaded_data_id uploaded_data_id, " +
     "  m.suff_record_index suff_record_index " +
     " from human_suff_record_map m, " +
     "   uploaded_data u " +
     " where u.id = m.uploaded_data_id and suff_record_index in (" + rec_id_list.join(",") + ")"
  r = g_db.exec(q);
  var mdata = format_sqlite_result(r);
  var rcv_data = [];
  for (var i=1; i<mdata.length; i++) {
    if (!(mdata[i][2] in row_idx)) { continue; }
    if (!(mdata[i][3] in col_idx)) { continue; }
    var ridx = row_idx[ mdata[i][2] ];
    var cidx = col_idx[ mdata[i][3] ];

    var j_map = col_map[mdata[i][3]];

    //rcv_data.push({"row" : ridx, "col": cidx, "value": 5});
    //rcv_data.push({"row" : ridx, "col": cidx, "value": j_map[2]});
    rcv_data.push({"row" : ridx+1, "col": cidx+1, "value": j_map[2]});
  }

  plot_matrix(graph_id, rcv_data, row_label, col_label);
}

function suff_eval_matrix_example(graph_id) {
  var q = " select id, json_record " +
      " from suff_record where " +
      " (json_record like '%,4,%\"Likely\"%' or json_record like '%,5,%\"Likely\"%' or json_record like '%,6,%\"Likely\"%' ) " +
      "  and json_record not like '%benign%' " +
      " limit 50";
  var r = g_db.exec(q);
  var col_data = format_sqlite_result(r);

  var rec_id_list = [];
  var col_label = [];
  var col_idx = {};
  var col_map = {};
  for (var i=1; i<col_data.length; i++) {
    var v = JSON.parse(col_data[i][1]);
    col_label.push(v[5] + ":" + v[8]);
    col_idx[col_data[i][0]] = col_label.length-1;
    col_map[col_data[i][0]] = v;
    rec_id_list.push(col_data[i][0]);
  }

  q = "select id, human_id from uploaded_data where ( name like '%CGI%' or name like '%23and%' ) and name not like '%master%'  order by human_id";
  r = g_db.exec(q);
  var row_data = format_sqlite_result(r);
  var row_label = [];
  var row_idx = {};
  for (var i=1; i<row_data.length; i++) {
    row_label.push(row_data[i][1] + ":" + row_data[i][0]);
    row_idx[row_data[i][0]] = row_label.length-1;
  }

  q = "select m.id id, " +
     "  u.human_id human_id, " +
     "  m.uploaded_data_id uploaded_data_id, " +
     "  m.suff_record_index suff_record_index " +
     " from human_suff_record_map m, " +
     "   uploaded_data u " +
     " where u.id = m.uploaded_data_id and suff_record_index in (" + rec_id_list.join(",") + ")"
  r = g_db.exec(q);
  var mdata = format_sqlite_result(r);
  var rcv_data = [];
  for (var i=1; i<mdata.length; i++) {
    if (!(mdata[i][2] in row_idx)) { continue; }
    if (!(mdata[i][3] in col_idx)) { continue; }
    var ridx = row_idx[ mdata[i][2] ];
    var cidx = col_idx[ mdata[i][3] ];

    var j_map = col_map[mdata[i][3]];

    //rcv_data.push({"row" : ridx, "col": cidx, "value": 5});
    //rcv_data.push({"row" : ridx, "col": cidx, "value": j_map[2]});
    rcv_data.push({"row" : ridx+1, "col": cidx+1, "value": j_map[2]});
  }

  plot_matrix(graph_id, rcv_data, row_label, col_label);
}

var debug_state = {};

function plot_matrix(graph_id, DATA, rowLabel, colLabel) {

  var margin = { top: 250, right: 10, bottom: 50, left: 120 };
  var cellSize=12;
  //var cellSize=15;
  var col_number=colLabel.length;
  var row_number=rowLabel.length;
  var width = cellSize*col_number;
  var height = cellSize*row_number;
  var legendElementWidth = cellSize*2.5;

  var colorBuckets = 21;
  var colors = ['#005824','#1A693B','#347B53','#4F8D6B','#699F83','#83B09B','#9EC2B3','#B8D4CB','#D2E6E3','#EDF8FB','#FFFFFF','#F1EEF6','#E6D3E1','#DBB9CD','#D19EB9','#C684A4','#BB6990','#B14F7C','#A63467','#9B1A53','#91003F'];

  var hcrow = [];
  var hccol = [];

  for (var i=0; i<rowLabel.length; i++) { hcrow.push(i+1); }
  for (var i=0; i<colLabel.length; i++) { hccol.push(i+1); }

  debug_state["hcrow"] = hcrow;
  debug_state["hccol"] = hccol;

  var load = function(data) {
    var colorScale = d3.scale.quantile()
        .domain([ -10 , 0, 10])
        .range(colors);

    //d3.select("svg").remove();
    d3.select("#" + graph_id).select("svg").remove();


    var svg = d3.select("#graph-matrix").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;
    var rowSortOrder=false;
    var colSortOrder=false;
    var rowLabels = svg.append("g")
        .selectAll(".rowLabelg")
        .data(rowLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hcrow.indexOf(i+1) * cellSize; })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + cellSize / 1.5 + ")")
        .attr("class", function (d,i) { return "rowLabel mono r"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        //.on("click", function(d,i) {rowSortOrder=!rowSortOrder; sortbylabel("r",i,rowSortOrder);d3.select("#order").property("selectedIndex", 4).node().focus();;})
        ;

    var colLabels = svg.append("g")
        .selectAll(".colLabelg")
        .data(colLabel)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", 0)
        .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize; })
        .style("text-anchor", "left")
        .attr("transform", "translate("+cellSize/2 + ",-6) rotate (-90)")
        .attr("class",  function (d,i) { return "colLabel mono c"+i;} )
        .on("mouseover", function(d) {d3.select(this).classed("text-hover",true);})
        .on("mouseout" , function(d) {d3.select(this).classed("text-hover",false);})
        //.on("click", function(d,i) {colSortOrder=!colSortOrder;  sortbylabel("c",i,colSortOrder);d3.select("#order").property("selectedIndex", 4).node().focus();;})
        ;

    var heatMap = svg.append("g").attr("class","g3")
          .selectAll(".cellg")
          .data(data,function(d){return d.row+":"+d.col;})
          .enter()
          .append("rect")
          .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize ; })
          .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize ; })
          .attr("class", function(d){return "cell cell-border cr"+(d.row-1)+" cc"+(d.col-1);})
          .attr("width", cellSize)
          .attr("height", cellSize)
          .style("fill", function(d) { return colorScale(d.value); })
          /* .on("click", function(d) {
                 var rowtext=d3.select(".r"+(d.row-1));
                 if(rowtext.classed("text-selected")==false){
                     rowtext.classed("text-selected",true);
                 }else{
                     rowtext.classed("text-selected",false);
                 }
          })*/
          .on("mouseover", function(d){
                 //highlight text
                 d3.select(this).classed("cell-hover",true);
                 d3.selectAll(".rowLabel").classed("text-highlight",function(r,ri){ return ri==(d.row-1);});
                 d3.selectAll(".colLabel").classed("text-highlight",function(c,ci){ return ci==(d.col-1);});

                 //Update the tooltip position and value
                 d3.select("#tooltip")
                   .style("left", (d3.event.pageX+10) + "px")
                   .style("top", (d3.event.pageY-10) + "px")
                   .select("#value")
                   .text("labels:"+rowLabel[d.row-1]+","+colLabel[d.col-1]+"\ndata:"+d.value+"\nrow-col-idx:"+d.col+","+d.row+"\ncell-xy "+this.x.baseVal.value+", "+this.y.baseVal.value);
                 //Show the tooltip
                 d3.select("#tooltip").classed("hidden", false);
          })
          .on("mouseout", function(){
                 d3.select(this).classed("cell-hover",false);
                 d3.selectAll(".rowLabel").classed("text-highlight",false);
                 d3.selectAll(".colLabel").classed("text-highlight",false);
                 d3.select("#tooltip").classed("hidden", true);
          })
          ;

          /*
    var legend = svg.selectAll(".legend")
        .data([-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10])
        .enter().append("g")
        .attr("class", "legend");
        */

          /*
    legend.append("rect")
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height+(cellSize*2))
      .attr("width", legendElementWidth)
      .attr("height", cellSize)
      .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return d; })
      .attr("width", legendElementWidth)
      .attr("x", function(d, i) { return legendElementWidth * i; })
      .attr("y", height + (cellSize*4));
      */

  // Change ordering of cells

    function sortbylabel(rORc,i,sortOrder){
         var t = svg.transition().duration(3000);
         var log2r=[];
         var sorted; // sorted is zero-based index
         d3.selectAll(".c"+rORc+i)
           .filter(function(ce){
              log2r.push(ce.value);
            })
         ;
         if(rORc=="r"){ // sort log2ratio of a gene
           sorted=d3.range(col_number).sort(function(a,b){ if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
           t.selectAll(".cell")
             .attr("x", function(d) { return sorted.indexOf(d.col-1) * cellSize; })
             ;
           t.selectAll(".colLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; })
           ;
         }else{ // sort log2ratio of a contrast
           sorted=d3.range(row_number).sort(function(a,b){if(sortOrder){ return log2r[b]-log2r[a];}else{ return log2r[a]-log2r[b];}});
           t.selectAll(".cell")
             .attr("y", function(d) { return sorted.indexOf(d.row-1) * cellSize; })
             ;
           t.selectAll(".rowLabel")
            .attr("y", function (d, i) { return sorted.indexOf(i) * cellSize; })
           ;
         }
    }

    //d3.select("#order").on("change",function(){ order(this.value); });

    function order(value){
     if(value=="hclust"){
      var t = svg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("x", function(d) { return hccol.indexOf(d.col) * cellSize; })
        .attr("y", function(d) { return hcrow.indexOf(d.row) * cellSize; })
        ;

      t.selectAll(".rowLabel")
        .attr("y", function (d, i) { return hcrow.indexOf(i+1) * cellSize; })
        ;

      t.selectAll(".colLabel")
        .attr("y", function (d, i) { return hccol.indexOf(i+1) * cellSize; })
        ;

     }else if (value=="probecontrast"){
      var t = svg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("x", function(d) { return (d.col - 1) * cellSize; })
        .attr("y", function(d) { return (d.row - 1) * cellSize; })
        ;

      t.selectAll(".rowLabel")
        .attr("y", function (d, i) { return i * cellSize; })
        ;

      t.selectAll(".colLabel")
        .attr("y", function (d, i) { return i * cellSize; })
        ;

     }else if (value=="probe"){
      var t = svg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("y", function(d) { return (d.row - 1) * cellSize; })
        ;

      t.selectAll(".rowLabel")
        .attr("y", function (d, i) { return i * cellSize; })
        ;
     }else if (value=="contrast"){
      var t = svg.transition().duration(3000);
      t.selectAll(".cell")
        .attr("x", function(d) { return (d.col - 1) * cellSize; })
        ;
      t.selectAll(".colLabel")
        .attr("y", function (d, i) { return i * cellSize; })
        ;
     }
    }


    /*
    //
    var sa=d3.select(".g3")
        .on("mousedown", function() {
            if( !d3.event.altKey) {
               d3.selectAll(".cell-selected").classed("cell-selected",false);
               d3.selectAll(".rowLabel").classed("text-selected",false);
               d3.selectAll(".colLabel").classed("text-selected",false);
            }
           var p = d3.mouse(this);
           sa.append("rect")
           .attr({
               rx      : 0,
               ry      : 0,
               class   : "selection",
               x       : p[0],
               y       : p[1],
               width   : 1,
               height  : 1
           })
        })
        .on("mousemove", function() {
           var s = sa.select("rect.selection");

           if(!s.empty()) {
               var p = d3.mouse(this),
                   d = {
                       x       : parseInt(s.attr("x"), 10),
                       y       : parseInt(s.attr("y"), 10),
                       width   : parseInt(s.attr("width"), 10),
                       height  : parseInt(s.attr("height"), 10)
                   },
                   move = {
                       x : p[0] - d.x,
                       y : p[1] - d.y
                   }
               ;

               if(move.x < 1 || (move.x*2<d.width)) {
                   d.x = p[0];
                   d.width -= move.x;
               } else {
                   d.width = move.x;
               }

               if(move.y < 1 || (move.y*2<d.height)) {
                   d.y = p[1];
                   d.height -= move.y;
               } else {
                   d.height = move.y;
               }
               s.attr(d);

                   // deselect all temporary selected state objects
               d3.selectAll('.cell-selection.cell-selected').classed("cell-selected", false);
               d3.selectAll(".text-selection.text-selected").classed("text-selected",false);

               d3.selectAll('.cell').filter(function(cell_d, i) {
                   if(
                       !d3.select(this).classed("cell-selected") &&
                           // inner circle inside selection frame
                       (this.x.baseVal.value)+cellSize >= d.x && (this.x.baseVal.value)<=d.x+d.width &&
                       (this.y.baseVal.value)+cellSize >= d.y && (this.y.baseVal.value)<=d.y+d.height
                   ) {

                       d3.select(this)
                       .classed("cell-selection", true)
                       .classed("cell-selected", true);

                       d3.select(".r"+(cell_d.row-1))
                       .classed("text-selection",true)
                       .classed("text-selected",true);

                       d3.select(".c"+(cell_d.col-1))
                       .classed("text-selection",true)
                       .classed("text-selected",true);
                   }
               });
           }
        })
        .on("mouseup", function() {
              // remove selection frame
           sa.selectAll("rect.selection").remove();

               // remove temporary selection marker class
           d3.selectAll('.cell-selection').classed("cell-selection", false);
           d3.selectAll(".text-selection").classed("text-selection",false);
        })
        .on("mouseout", function() {
           if(d3.event.relatedTarget.tagName=='html') {
                   // remove selection frame
               sa.selectAll("rect.selection").remove();
                   // remove temporary selection marker class
               d3.selectAll('.cell-selection').classed("cell-selection", false);
               d3.selectAll(".rowLabel").classed("text-selected",false);
               d3.selectAll(".colLabel").classed("text-selected",false);
           }
        })
        ;
        */
  };

  load(DATA);
}
