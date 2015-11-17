#!/bin/bash
#
# Get a list of huids and enrollment dates and store them in
#
#  untap/scripts/scratch/hid-enrolldate.list
#
#  Example contents:
#  hu43860C,2010-11-20T19:58:47Z


set -e
set -o pipefail

echo "Grabbing enrollment date data..."
ofn1="scratch/hid.list"
ofn2="scratch/enrolldate.list"
ofn3="scratch/hid-enrolldate.list"
odir=`dirname $ofn1`

verbose=true

mkdir -p $odir

h0='X-Requested-With: XMLHttpRequest'
h1='Accept: application/json, text/javascript, */*; q=0.01'
url='https://my.pgp-hms.org/users'
adj_param='iDisplayStart'
d_param='iDisplayLength'
dn='100'
param='sEcho=1&iColumns=8&sColumns=&mDataProp_0=pgp_id&mDataProp_1=hex&mDataProp_2=enrolled&mDataProp_3=received_sample_materials&mDataProp_4=has_ccrs&mDataProp_5=has_relatives_enrolled&mDataProp_6=has_whole_genome_data&mDataProp_7=has_other_genetic_data&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&sSearch_7=&bRegex_7=false&bSearchable_7=true&iSortingCols=1&iSortCol_0=0&sSortDir_0=asc&bSortable_0=true&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=true&bSortable_7=true'

tot_rec=`curl --silent -H "$h0" -H "$h1" "$url?$adj_param=0&$d_param=10&$param" | jq '.iTotalRecords'`

rm -f $ofn1
rm -f $ofn2
rm -f $ofn3

cur_start="0"
while [ "$cur_start" -lt "$tot_rec" ]
do
  $verbose && echo "$cur_start / $tot_rec"
  data=$(curl --silent -H "$h0" -H "$h1" "$url?$adj_param=$cur_start&$d_param=$dn&$param"i)

  # find huIDs and put them in first output file
  echo $data | jq -r '.aaData[].hex' | egrep -v '^null$' >> $ofn1
  # find enrollment dates and put them in second output file
  echo $data | jq -r '.aaData[].enrolled' | egrep -v '^null$' >> $ofn2

  # zip columns together and put in third output file 
  paste $ofn1 $ofn2 >> $ofn3

  #increment
  cur_start=`expr "$cur_start" "+" "$dn"`
done

echo "Done grabbing enrollment date data."

exit 0
