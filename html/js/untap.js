
var g_db;

$(document).ready( function() {

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'db/untap.sqlite3.gz', true);
  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    console.log(">>>ok", e);


    var uInt8Array = new Uint8Array(this.response);
    var gunzip = new Zlib.Gunzip(uInt8Array);
    var unpacked_uInt8Array = gunzip.decompress();


    g_db = new SQL.Database(unpacked_uInt8Array);

    console.log(">>> database loaded....", g_db);

  };

  xhr.send();

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


