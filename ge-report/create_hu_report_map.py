#!/usr/bin/python

import json
import sys
import os
import subprocess as sp

import csv

suff_a = []
insuff_a = []

suff = {}
insuff = {}

#fp = open("out-data/ge-suff.tsv")
#k=0
#for line in fp:
#  line = line.strip()
#  suff_a.append(line)
#  suff[line] = k
#  k+=1
#fp.close

with open("out-data/ge-suff.tsv") as fp:
  r = csv.reader(fp, delimiter="\t")
  for row in r:
    str_id = row[0].strip()
    json_line = row[1].strip()
    suff_a.append(json_line)
    suff[json_line] = str_id


#fp = open("out-data/ge-insuff.tsv")
#k=0
#for line in fp:
#  line = line.strip()
#  insuff_a.append(line)
#  insuff[line] = k
#  k += 1
#fp.close()

with open("out-data/ge-insuff.tsv") as fp:
  r = csv.reader(fp, delimiter="\t")
  for row in r:
    str_id = row[0].strip()
    json_line = row[1].strip()
    insuff_a.append(json_line.strip())
    insuff[json_line] = str_id


suff_ofp_raw = open("out-data/ge-suff-hu-map.tsv", "w")
insuff_ofp_raw = open("out-data/ge-insuff-hu-map.tsv", "w")
#hu_rep_ofp_raw = open("out-data/human-report-map.tsv", "w")

suff_ofp = csv.writer(suff_ofp_raw, delimiter="\t", lineterminator="\n")
insuff_ofp = csv.writer(insuff_ofp_raw, delimiter="\t", lineterminator="\n")
#hu_rep_ofp = csv.writer(hu_rep_ofp_raw, delimiter="\t", lineterminator="\n")

hu_rep_map = {}
hu_rep_ind = 0

#suff_ofp.write("human_id\tlocator\tcsvlist\n")
#insuff_ofp.write("human_id\tlocator\tcsvlist\n")

#suff_ofp.write("human_report_id\tcsvlist\n")
#insuff_ofp.write("human_report_id\tcsvlist\n")
#hu_rep_ofp.write("id\thuman_id\tlocator\n")

INCLUDE_HEADER=False

if INCLUDE_HEADER:
  suff_ofp.writerow(["human_report_id", "csvlist"])
  insuff_ofp.writerow(["human_report_id","csvlist"])
  #hu_rep_ofp.writerow(["id","human_id","locator"])


fp = open("json_reports.list")
for line in fp:
  line = line.strip()
  print line

  z = line.split('/')
  #zz = z[2].split('-')
  t = z[2].split(':')
  uploaded_data_id = t[0]


#  hu_rep_key = z[1] + "\t" + zz[1]
#  cur_rep_ind = -1
#  if hu_rep_key not in hu_rep_map:
#    cur_rep_ind = hu_rep_ind
#    hu_rep_map[hu_rep_key] = hu_rep_ind
#    #hu_rep_ofp.write(str(hu_rep_ind) + "\t" + str(hu_rep_key) + "\n")
#    hu_rep_ofp.writerow([str(hu_rep_ind), str(z[1]), str(zz[1])])
#    hu_rep_ind+=1
#  else:
#    cur_rep_ind = hu_rep_map[hu_rep_key]

  suff_list=[]
  insuff_list=[]

  line = line.strip()

  p = sp.Popen("jq -c '.variants.suff[] | [ .variant_impact, .allele_freq, .autoscore, .clinical, .evidence, .name , .suff_eval, .variant_impact, .zygosity, .expect_effect ]' " + line + " 2> /dev/null", shell=True, stdout=sp.PIPE)
  for c in iter(p.stdout.readline, ''):
    c = c.strip()
    if c in suff:
      suff_list.append( str(suff[c]) )
    else:
      print "ERROR", c, "not found"
      sys.exit()

  p = sp.Popen("jq -c '.variants.insuff[] | [ .variant_impact, .allele_freq, .autoscore, .clinical, .evidence, .name , .suff_eval, .variant_impact, .zygosity, .expect_effect ]' " + line + " 2> /dev/null", shell=True, stdout=sp.PIPE)
  for c in iter(p.stdout.readline, ''):
    c = c.strip()
    if c in insuff:
      insuff_list.append( str(insuff[c]) )
    else:
      print "ERROR", c, "not found"
      sys.exit()

  for ind in suff_list:
    #suff_ofp.write( str(cur_rep_ind) + "\t" + str(ind) + "\n" )
    #suff_ofp.writerow([str(cur_rep_ind), str(ind)])
    suff_ofp.writerow([str(uploaded_data_id), str(ind)])

  for ind in insuff_list:
    #insuff_ofp.write( str(cur_rep_ind) + "\t" + str(ind) + "\n" )
    #insuff_ofp.writerow([str(cur_rep_ind), str(ind)])
    insuff_ofp.writerow([str(uploaded_data_id), str(ind)])

fp.close()
suff_ofp_raw.close()
insuff_ofp_raw.close()
#hu_rep_ofp_raw.close()
