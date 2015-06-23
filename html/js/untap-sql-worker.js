importScripts('sql.js');
importScripts('gunzip.min.js');

var xhr = new XMLHttpRequest();
xhr.open('GET', '../../hu-pgp.sqlite3.gz', true);
xhr.responseType = 'arraybuffer';

var g_self = self;

xhr.onload = function(e) {

  console.log("ok>>");

  var uInt8Array = new Uint8Array(this.response);
  var gunzip = new Zlib.Gunzip(uInt8Array);
  var unpacked_uInt8Array = gunzip.decompress();
  g_self.postMessage(unpacked_uInt8Array);
  //g_db = new SQL.Database(unpacked_uInt8Array);
};

xhr.send();


