#!/bin/bash
#
# It's easier to convert to the HTML/XML to JSON then parse
# it that way. 'pup' is an alternative to do direct
# command line parsing of HTML if xml2json proves to
# be too clunky.
#
# Download the survey page, parse out name and download
# links.  Delete weird characters in name and replace
# spaces with underscores.  Download CSV and name
# it the apprpriate csv file.
#

set -e
set -o pipefail

STAGING_DIR="stage"
OUTPUT_DIR="out-data"

#URL="https://my.pgp-hms.org"

mkdir -p $STAGING_DIR
mkdir -p $OUTPUT_DIR

while read line
do
  nam=`echo "$line" | jq -r .name`
  link=`echo "$line" | jq -r .dl`

  clean_name=`echo "$nam" | tr -d '&:' | sed 's/  */_/g' `

  echo "$clean_name $link"

  #wget -q "$URL/$link" -O $STAGING_DIR/$clean_name.csv
  wget -q "$link" -O $STAGING_DIR/$clean_name.csv

#done < <( wget -q "$URL/google_surveys" -O - | xml2json | jq -c '.html.body.div[0].div[2].table.tbody.tr[] | { "name" : .td[0].a["#text"], "dl" : .td[5].a["@href"] }' )
done < survey_location.json


mv stage/PGP_Trait_Disease_Survey_2012_Endocrine,_Metabolic,_Nutritional,_and_Immunity.csv stage/PGP_Trait_Disease_Survey_2012_Endocrine_Metabolic_Nutritional_and_Immunity.csv

for f in `ls $STAGING_DIR/*.csv`
do
  bn=`basename $f`
  mv $f $OUTPUT_DIR/$bn
done

#rmdir $STAGING_DIR
