#!/bin/bash
#

set -e
set -o pipefail

url="https://my.pgp-hms.org/profile"

fn=$1
test -z $fn && echo "provide filename" && exit 1

for huid in `cat $fn`
do
  echo $huid

  tdir="scratch/$huid"
  mkdir -p $tdir

  wget --quiet "$url/$huid" -O $tdir/$huid.html

  z=`cat $tdir/$huid.html | pup 'h3:contains("Personal Health Records") + div'`
  if [ ! -z "$z" ]
  then

    # demogrpahics
    cat $tdir/$huid.html | pup 'h3:contains("Demographic") + table tbody json{}' | jq -c '.[0].children[].children | [ .[0].text, .[1].text ] ' > $tdir/$huid.demographics

    # conditions
    cat $tdir/$huid.html | pup 'h3:contains("Conditions") + table tbody json{}' | jq -c '.[0].children[] | [ .children[0].text,  .children[1].text, .children[2].text  ]' > $tdir/$huid.conditions

    # medications
    cat $tdir/$huid.html | pup 'h3:contains("Medication") + table tbody json{}' | jq -c '.[0].children[].children | [.[0].text, .[1].text, .[2].text, .[3].text, .[4].text ]' > $tdir/$huid.medications

    # allergies
    cat $tdir/$huid.html | pup 'h3:contains("Allergies") + table tbody json{}' | jq -c '.[0].children[].children | [.[0].text, .[1].text, .[2].text, .[3].text]' > $tdir/$huid.allergies

    # procedures
    cat $tdir/$huid.html | pup 'h3:contains("Procedures") + table tbody json{}' | jq -c '.[0].children[].children | [.[0].text, .[1].text]' > $tdir/$huid.procedures

    # test results
    cat $tdir/$huid.html | pup 'h3:contains("Test Results") + table tbody json{}' | jq -c '.[0].children[].children | [.[0].text, .[1].text, .[2].text]' > $tdir/$huid.test_results

    # immunizations
    cat $tdir/$huid.html | pup 'h3:contains("Immunizations") + table tbody json{}' | jq -c '.[0].children[].children | [.[0].text, .[1].text]' > $tdir/$huid.immunizations

  fi

  z=`cat $tdir/$huid.html | pup 'h3:contains("Uploaded") + div'`
  if [ ! -z "$z" ]
  then

    # uploaded data
    cat $tdir/$huid.html | pup 'h3:contains("Uploaded") + div table json{}' | jq -c '.[0].children[].children'  | egrep -v '^null$' | jq  -c '.[].children[1:] | [.[0].text, .[1].text, .[2].text, .[3].text, .[4].text, .[4].children[0].href, .[5].text, .[5].children[0].href ]' > $tdir/$huid.uploaded_data

  fi


done
