
var g_db;

var g_suff_record = {};
var g_insuff_record = {};

var g_suff_record_map = {};
var g_insuff_record_map = {};

var g_suff_stat = {};
var g_insuff_stat = {};

var g_hu_vec = [];

function init_untap() {


  var sql_data = g_db.exec("select id, json_record from suff_record");
  for (var ind=0; ind<sql_data[0].values.length; ind++) {
    var id = sql_data[0].values[ind][0];
    var rec = sql_data[0].values[ind][1];

    //HACK
    if (rec == "json_report") continue;

    g_suff_record[id] = JSON.parse(rec);
  }

  var max_rec_idx = 0;

  var sql_data = g_db.exec("select u.human_id, r.id, r.uploaded_data_id, r.suff_record_index from uploaded_data u, human_suff_record_map r where r.uploaded_data_id = u.id");
  for (var ind=0; ind<sql_data[0].values.length; ind++) {
    var human_id = sql_data[0].values[ind][0];
    var id = sql_data[0].values[ind][1];
    var uploaded_data_id = sql_data[0].values[ind][2];
    var suff_record_idx = sql_data[0].values[ind][3];

    if (!(human_id in g_suff_record_map)) {
      g_suff_record_map[human_id] = {};
    }

    if (!(uploaded_data_id in g_suff_record_map[human_id])) {
      g_suff_record_map[human_id][uploaded_data_id] = [];
    }

    g_suff_record_map[human_id][uploaded_data_id].push(suff_record_idx);

    if (!(suff_record_idx in g_suff_stat)) { g_suff_stat[suff_record_idx] = 0; }
    g_suff_stat[suff_record_idx]++;

    if (max_rec_idx < suff_record_idx) { max_rec_idx = suff_record_idx; }
  }


  var hu_ind = 0;
  var hu_pos = {};
  var hu_vec = [];
  for (var huid in g_suff_record_map) {
    hu_pos[huid] = hu_ind;
    hu_ind++;

    var v_vec = [];
    for (var i=0; i<max_rec_idx; i++) { v_vec.push(0); }
    for (var upid in g_suff_record_map[huid]) {
      for (var ii=0; ii<g_suff_record_map[huid][upid].length; ii++) {
        v_vec[ g_suff_record_map[huid][upid][ii] ] = 1;
      }
    }
    hu_vec.push(v_vec);
  }

  g_hu_vec = hu_vec;

  var sql_data = g_db.exec("select id, json_record from insuff_record");
  for (var ind=0; ind<sql_data[0].values.length; ind++) {
    var id = sql_data[0].values[ind][0];
    var rec = sql_data[0].values[ind][1];

    //HACK
    if (rec == "json_report") continue;

    g_insuff_record[id] = JSON.parse(rec);


  }


  // there are too many insuff records (1.7M) and it becomes unwieldy.
  //
  /*
  var sql_data = g_db.exec("select u.human_id, r.id, r.uploaded_data_id, r.insuff_record_index from uploaded_data u, human_insuff_record_map r where r.uploaded_data_id = u.id");
  for (var ind=0; ind<sql_data[0].values.length; ind++) {
    var human_id = sql_data[0].values[ind][0];
    var id = sql_data[0].values[ind][1];
    var uploaded_data_id = sql_data[0].values[ind][2];
    var insuff_record_idx = sql_data[0].values[ind][3];

    //if (!(human_id in g_insuff_record_map)) { g_insuff_record_map[human_id] = {}; }
    //if (!(uploaded_data_id in g_insuff_record_map[human_id])) { g_insuff_record_map[human_id][uploaded_data_id] = []; }
    //g_insuff_record_map[human_id][uploaded_data_id].push(insuff_record_idx);

    if (!(insuff_record_idx in g_insuff_stat)) { g_insuff_stat[insuff_record_idx] = 0; }
    g_insuff_stat[insuff_record_idx]++;
  }
  */





}

$(document).ready( function() {

  // Use a web worker to load the SQL database so it
  // doesn't drag everything to a halt.
  //
  var wurk = new Worker("js/untap-sql-worker.js");
  wurk.addEventListener('message', function(e) {
    var uintarray = e.data;
    g_db = new SQL.Database(uintarray);
  });


  return;

  /*
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'db/untap.sqlite3.gz', true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {

    var uInt8Array = new Uint8Array(this.response);
    var gunzip = new Zlib.Gunzip(uInt8Array);
    var unpacked_uInt8Array = gunzip.decompress();

    g_db = new SQL.Database(unpacked_uInt8Array);
    init_untap();

  };

  xhr.send();
  */

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
