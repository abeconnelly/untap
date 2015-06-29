
var g_db;

var g_suff_record = {};
var g_insuff_record = {};

var g_suff_record_map = {};
var g_insuff_record_map = {};

var g_suff_stat = {};
var g_insuff_stat = {};

var g_hu_vec = [];


// Simple map of sample queries for each table.
//
var example_query_map = {
  "survey" : "select * \nfrom survey limit 10",
  "uploaded_data" : "select * from uploaded_data limit 10",
  "allergies" : "select * from allergies limit 10",
  "conditions" : "select * from conditions limit 10",
  "demographics" : "select * from demographics limit 10",
  "immunizations" : "select * from immunizations limit 10",
  "medications" : "select * from medications limit 10",
  "procedures" : "select * from procedures limit 10",
  "test_results" : "select * from test_results limit 10",
  "suff_record" : "select * from suff_record limit 10",
  "human_suff_record_map" : "select * from human_suff_record_map limit 10",
  "insuff_record" : "select * from insuff_record limit 10",
  "human_insuff_record_map" : "select * from human_insuff_record_map limit 10",
};

// Fill in the textarea 'example-textarea' with the sample query
//
function untap_example_query(table_name) {
  var textarea = document.getElementById("example-textarea");

  if (table_name in example_query_map) {
    //textarea.innerHTML = example_query_map[table_name];
    textarea.value = example_query_map[table_name];
    untap_exec_example_query();
  } else {
    //textarea.innerHTML = "/* sorry, not found */";
    textarea.innerHTML = "/* sorry, not found */";
  }
}


// Create table of results from the results of the contents of
// the 'example-textarea' text input.
// Give an error as a 'span' label
// on error.
//
function untap_exec_example_query() {
  var textarea = document.getElementById("example-textarea");
  var q = textarea.value;

  try {
    var sql_data = g_db.exec(q);
    var v = format_sqlite_result(sql_data);

    var htable = ["<table class='table table-bordered'><tr>"];
    for (var h=0; h<v[0].length; h++) {
      htable.push("<th>" + v[0][h] + "</th>");
    }
    htable.push("</tr>");

    for (var r=1; r<v.length; r++) {
      htable.push("<tr>");
      for (var c=0; c<v[r].length; c++) {
        htable.push("<td>" + v[r][c] + "</td>");
      }
      htable.push("</tr>");
    }

    $("#example-table-result").html(htable.join(""));
  } catch (e) {
    var html_err_msg = "<span class='label label-danger'>" + e.message + "</span>";
    $("#example-table-result").html(html_err_msg);
    return;
  }

}

$(document).ready( function() {

  // Use a web worker to load the SQL database so it
  // doesn't drag everything to a halt.
  //
  var wurk = new Worker("js/untap-sql-worker.js");
  wurk.addEventListener('message', function(e) {
    var uintarray = e.data;
    g_db = new SQL.Database(uintarray);

    plot_survey_bargraph('graph', 'Year of birth', 'Year of birth');

    suff_eval_matrix_example('graph-matrix');

    untap_custom_query(
  "select p0.phenotype x,\n  sum( p1.phenotype = \"Male\") \"Male\", sum( p1.phenotype = \"Female\") \"Female\"\nfrom survey p0, survey p1\nwhere p0.phenotype_category = \"Participant_Survey:Age\" and p0.human_id = p1.human_id and p1.phenotype_category = \"Participant_Survey:Sex/Gender\"\ngroup by x"
    );

  });

});




// Expects data as a simple array of arrays, where the first row
// contains the header information (column names).
// Resulting array is an array of objects where they key in each
// object is the header as it appears in the first row.
// For example:
//   data = [ ["foo", "bar"], [1, 2], [3,4] ];
// would produce:
//   r = [ { "foo" : 1, "bar": 2 }, {"foo" : 3, "bar" : 4} ]
//
function transform_data(data) {
  var r = [];
  header = data[0];
  for (var i=1; i<data.length; i++) {
    var ele = {};
    for (var j=0; j<data[i].length; j++) {
      ele[header[j]] = data[i][j];
    }
    r.push(ele);
  }
  return r;
}

function format_sqlite_result(data, group_label) {
  group_label = ((typeof group_label === "undefined")?{}:group_label);

  var r = [];
  var header = [];
  for (var ind=0; ind<data[0].columns.length; ind++) {

    if (data[0].columns[ind] in group_label) {
      header.push( group_label[ data[0].columns[ind] ] );
    } else {
      header.push(data[0].columns[ind]);
    }

  }

  r.push(header);
  for (var ind=0; ind<data[0].values.length; ind++) {
    var ele = [];
    for (var i=0; i<data[0].values[ind].length; i++) {
      ele.push(data[0].values[ind][i]);
    }
    r.push(ele);
  }
  return r;
}


// This uses google/palette.js.  We've abstracted it a bit
// so we can swap out something else if we want to.
//
function color_palette(n) {
  var seq = palette('tol', n);
  for (var i=0; i<seq.length; i++) { seq[i] = "#" + seq[i]; }
  return seq;
}
