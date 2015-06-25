
function untap_custom_query(q) {

  var textarea = document.getElementById("custom-textarea");
  textarea.value = q;

  untap_custom_viz();


  /*

  try {
    var sql_data = g_db.exec(q);
    var xyy = format_sqlite_result(sql_data);
    bargraph_grouped("graph-custom", xyy, "Frequency", undefined, "custom");
  } catch (e) {
    var html_err_msg = "<span class='label label-danger'>" + e.message + "</span>";
    $("#graph-custom").html(html_err_msg);
    return;
  }
  */

}

function untap_custom_viz() {
  var textarea = document.getElementById("custom-textarea");

  var q = textarea.value;

  try {
    var sql_data = g_db.exec(q);
    var xyy = format_sqlite_result(sql_data);
    bargraph_grouped("graph-custom", xyy, "Frequency", undefined, "custom");
  } catch (e) {
    var html_err_msg = "<span class='label label-danger'>" + e.message + "</span>";
    $("#graph-custom").html(html_err_msg);
    return;
  }

}
