#!/bin/bash
#

base_coriell_url="https://catalog.coriell.org/0/Sections/Collections/NIGMS/"
base_coriell_id_url="https://catalog.coriell.org/0/Sections/Search/Sample_Detail.aspx?Ref="

mkdir -p stage
rm -f stage/coriell.json
rm -f stage/coriell_final.json

wget -q --no-check-certificate  'https://catalog.coriell.org/0/Sections/Collections/NIGMS/PGPs.aspx?PgId=772&coll=GM&json=true' -O - > stage/coriell.html

# NIGMS HGCR PGP Samples for Family Studies
#
cat stage/coriell.html | pup 'table[class=nestPgpTable] table#tblNoSubDtl tbody json{}' | jq -c '.[].children[]' | egrep 'PERSONAL GENOME PROJECT|APPARENTLY HEALTHY NON-FETAL TISSUE' | jq -c '.children | { "href" : ("'$base_coriell_url'" + .[0].children[0].href), "CoriellID" : .[0].children[0].text, "CellType" : .[2].text, "Gender" : .[3].text, "Age" : .[4].text, "Race" : .[5].text, "AssociateSpecimens" : .[6].text, "RelatioinshipToProband" : .[7].text, "FamilyMember" : .[8].text  }' >> stage/coriell.json

# Multiple NIGMS HGCR PGP Samples from the Same Subject*
#
cat stage/coriell.html | pup 'table[class=nestPgpTable] table#tblSubDtlFam tbody json{}' | jq -c '.[].children[].children'  | egrep 'PERSONAL GENOME PROJECT|APPARENTLY HEALTHY NON-FETAL TISSUE' | jq -c '. | { "href" : ("'$base_coriell_url'" + .[0].children[0].href), "CoriellID": .[0].children[0].text, "CellType": .[2].text, "Gender":.[3].text, "Age":.[4].text, "Race":.[5].text, "AssociatedSpecimens": .[6].children[0].text, "AssociatedSpecimenURL": ("'$base_coriell_url'" + .[6].children[0].href) }' >> stage/coriell.json

# All NIGMS HGCR PGP Samples Consented for Public Posting of PIGI (119 samples*) <-- lies
#
cat stage/coriell.html | pup 'table[class=nestPgpTable] table#grdPgpPIGI json{}' | jq -c '.[].children[].children[]' | egrep 'PERSONAL GENOME PROJECT|APPARENTLY HEALTHY NON-FETAL TISSUE' | jq -c '.children | { "href" : ("'$base_coriell_url'" + .[0].children[0].children[0].href), "CoriellID":.[0].children[0].children[0].text, "CellType": .[2].children[0].text, "Gender": .[3].children[0].text, "Age":.[4].children[0].text, "Race":.[5].children[0].text,  "AssociatedSpecimens":.[6].children[0].children[0].text, "AssociatedSpecimenURL": ("'$base_coriell_url'" + .[6].children[0].children[0].href)  } ' >> stage/coriell.json


while read line
do
  echo $line
  coriellid=`echo "$line" | jq -r .CoriellID`
  echo $coriellid

  url=${base_coriell_id_url}$coriellid
  rmk=`wget --no-check-certificate -q "$url" -O - | pup 'span#lblCat_Remark text{}' | tr -t '\n' ' '`
  huid=`echo "$rmk" | egrep -o 'hu[0-9A-F]*'`

  echo "$line" | jq -c '. + {"human_id":"'$huid'"}' >> stage/coriell_final.json

done < <( jq -c . stage/coriell.json )
