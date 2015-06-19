#!/bin/bash

of_suff="out-data/ge-suff-raw.tsv"
of_insuff="out-data/ge-insuff-raw.tsv"

mkdir -p out-data

#echo "variant_impact,allele_freq,autoscore,clinical,evidence,name,suff_eval,variant_impact,zygosity,expect_effect" > $of_suff
#echo "variant_impact,allele_freq,autoscore,clinical,evidence,name,suff_eval,variant_impact,zygosity,expect_effect" > $of_insuff

#echo "json_report" > $of_suff
#echo "json_report" > $of_insuff

for j in `find data -type f`
do
  echo $j

  #echo "variant_impact,allele_freq,autoscore,clinical,evidence,name,suff_eval,variant_impact,zygosity,expect_effect"
  #jq -c '.variants.suff[] | { "af" : .allele_freq, "score" : .autoscore, "clin": .clinical, "evidence" : .evidence, "name" : .name , "suff_eval" : .suff_eval, "impact" : .variant_impact, "zyg" : .zygosity, "expect_effect": .expect_effect }  ' $j
  jq -c '.variants.suff[] | [ .variant_impact, .allele_freq, .autoscore, .clinical, .evidence, .name , .suff_eval, .variant_impact, .zygosity, .expect_effect ]' $j >> $of_suff

  #echo ""

  #echo "variant_impact,allele_freq,autoscore,clinical,evidence,name,suff_eval,variant_impact,zygosity,expect_effect"
  #jq -c '.variants.insuff[] | { "af" : .allele_freq, "score" : .autoscore, "clin": .clinical, "evidence" : .evidence, "name" : .name , "suff_eval" : .suff_eval, "impact" : .variant_impact, "zyg" : .zygosity, "expect_effect": .expect_effect }  ' $j
  jq -c '.variants.insuff[] | [ .variant_impact, .allele_freq, .autoscore, .clinical, .evidence, .name , .suff_eval, .variant_impact, .zygosity, .expect_effect ]' $j >> $of_insuff

  #echo -e "\n\n--------------------------------\n\n"

done
