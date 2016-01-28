#!/bin/bash
#
# Get a list of huids and store them in
#
#  out-data/huid.list
#

set -e
set -o pipefail

ofn="scratch/specimens.tsv"
odir=`dirname $ofn`

verbose=true

mkdir -p $odir

h0='X-Requested-With: XMLHttpRequest'
h1='Accept: application/json, text/javascript, */*; q=0.01'
url='https://my.pgp-hms.org/specimens'
adj_param='iDisplayStart'
d_param='iDisplayLength'
dn='100'
param='sEcho=1&iColumns=8&sColumns=&mDataProp_0=pgp_id&mDataProp_1=hex&mDataProp_2=enrolled&mDataProp_3=received_sample_materials&mDataProp_4=has_ccrs&mDataProp_5=has_relatives_enrolled&mDataProp_6=has_whole_genome_data&mDataProp_7=has_other_genetic_data&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&iSortingCols=1&iSortCol_0=0&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true'

tot_rec=`curl --silent -H "$h0" -H "$h1" "$url?$adj_param=0&$d_param=10&$param" | jq '.iTotalRecords'`

rm -f $ofn

## header
##
echo "participant_hex,crc_id,amount,material,owner_researcher_affiliation,study_name,unit" | csvtool col 1- -u TAB - >> $ofn

cur_start="0"
while [ "$cur_start" -lt "$tot_rec" ]
do

  $verbose && echo "$cur_start / $tot_rec"

  #echo 'curl --silent -H '"$h0" '-H '"$h1" "$url?$adj_param=$cur_start&$d_param=$dn&$param"
  curl --silent -H "$h0" -H "$h1" "$url?$adj_param=$cur_start&$d_param=$dn&$param" | \
    jq -r -c '.aaData[] | [ .participant.hex, .crc_id, .amount, .material,
      .owner.researcher_affiliation,
      .study.name, .unit ] | @csv' | csvtool col 1- -u TAB - >> $ofn

#  req_url=$url'?sEcho=50&iColumns=10&sColumns=&iDisplayStart='$cur_start'&iDisplayLength=100&mDataProp_0=crc_id&mDataProp_1=material&mDataProp_2=study.name&mDataProp_3=kit.name&mDataProp_4=participant.hex&mDataProp_5=qc_result.QC+Status&mDataProp_6=owner.display_name&mDataProp_7=log_url&mDataProp_8=edit_url&mDataProp_9=delete_url&sSearch=&bRegex=undefined&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&sSearch_8=&bRegex_8=false&bSearchable_8=true&sSearch_9=&bRegex_9=false&bSearchable_9=true&iSortingCols=1&iSortCol_0=0&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=false&bSortable_7=false&bSortable_8=false&bSortable_9=false'
#  curl --silent "$req_url" >> $ofn

  cur_start=`expr "$cur_start" "+" "$dn"`

done

exit 0
