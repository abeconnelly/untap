#!/bin/bash
#
# Expects a tab delimited file with huid as it's first field
# and the report_url as it's second field.
#
# Puts each report into the 'data' directory.
#
# For example:
# $ head report_locations.csv
# hu826751  http://evidence.pgp-hms.org/genomes?display_genome_id=873fa756ec47292ea8f639127c2c9b3bf8e5a34f&access_token=025b17535cfed0e5725035d4d873fb3d
# ...
# $ ./download_reports.sh report_locations.csv
#

set -e
set -o pipefail

mkdir -p data

listfn="$1"

if [ ! -f "$listfn" ]
then
  echo "provide valid list file"
  exit 1
fi

BATCH=8

download_link() {
  local ofn=$1
  local url=$2

  ofd=`dirname "$ofn"`

  if ! mkdir -p "$ofd" ; then
    errmsg="Failed to create directory $ofd"
  elif ! wget -q "$url" -O "$ofn.stage" ; then
    errmsg="Failed to download $url -> $ofn"
  else
    echo "Downloaded $ofn (from $url)"
  fi

  mv $ofn.stage $ofn

}
export -f download_link

para_download_link() {
  local line="$1"

  local huid=`echo "$line" | cut -f1 -d'|'`
  local url=`echo "$line" | cut -f2 -d'|'`
  local dlid=`echo "$url" | egrep -o 'display_genome_id=[^&]*' | cut -f2- -d'=' | sed 's/\+/_/g'`
  local tok=`echo "$url" | egrep -o 'access_token=[^&]*' | cut -f2- -d'=' | sed 's/\+/_/g'`

  if [[ ! -z "$tok" ]]
  then
    tok="&access_token=$tok"
  fi
  local b_url=`echo "$url" | cut -f1 -d'?'`
  local fin_url="$b_url?display_genome_id=$dlid$tok&json=true"

  local ofn="data/$huid/$huid-$dlid-report.json"

  #local url="$url&json=true"
  #download_link $ofn $url

  download_link $ofn $fin_url
}
export -f para_download_link

sleepy() {
  local line="$1"
  sleep 1
}
export -f sleepy

#parallel --max-procs=$BATCH para_download_link ::: `cat $listfn`
parallel --max-procs=$BATCH para_download_link ::: `tail -n +2 $listfn`
