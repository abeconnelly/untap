#!/usr/bin/python

import os, sys
import json
import csv

import subprocess as sp

STAGE_DIR="stage"
OUT_DIR="out-data"

list_huid_fn = "scratch/hid.list"
inpdir = "scratch"

huids = []

with open(list_huid_fn) as fp:
  for l in fp:
    l = l.strip()
    if l == "": next
    huids.append(l)

phen_suffix = [ "allergies", "conditions", "immunizations", "medications", "procedures", "test_results", "uploaded_data" ]

phen_db_header = {}
phen_db = {}

for phen in phen_suffix:
  phen_db[phen] = []
  phen_db_header[phen] = []

DEMOGRAPHIC_LEN=7
phen_db_header["demographics"] = {}

demo_db_header= { "human_id" : 0, "Date of Birth" : 1,
  "Gender" : 2,
  "Weight" : 3,
  "Height" : 4,
  "Blood Type" : 5,
  "Race" : 6 }
phen_db["demographics"] = []

phen_db_header["demographics"] = [ "human_id", "Date of Birth", "Gender", "Weight", "Height", "Blood Type", "Race" ]

def load_phen(fn, db, huid):
  with open(fn) as fp:
    first = True
    for l in fp:
      l = l.strip()
      if l == "": next

      j = json.loads(l)

      if first:
        first = False
        #phen_db_header[db] = j
        z = ["human_id"] + j
        phen_db_header[db] = z
      else:
        z = [huid]
        for f in j:
          if f is not None:
            z.append(f.encode('utf8'))
          else:
            z.append(f)
        phen_db[db].append(z)

def load_demo(fn, huid):

  values = [None]*DEMOGRAPHIC_LEN
  values[0] = huid

  with open(fn) as fp:
    demo_pos = 1
    for l in fp:
      l = l.strip()
      if l == "": continue

      j = json.loads(l)
      ind = demo_db_header[j[0]]
      values[ind] = j[1]

    phen_db["demographics"].append(values)



for huid in huids:
  fqfn = os.path.join(inpdir, huid, huid)

  print os.path.join(inpdir, huid)
  for suffix in phen_suffix:
    if not os.path.exists( fqfn + "." + suffix): continue
    phen_fn = fqfn + "." + suffix
    load_phen(phen_fn, suffix, huid)

  if os.path.exists( fqfn + ".uploaded_data" ):
    print fqfn + ".uploaded_data"

for huid in huids:
  fqfn = os.path.join(inpdir, huid, huid)
  if not os.path.exists(fqfn + ".demographics"): continue
  load_demo(fqfn + ".demographics", huid)


sp.check_output(["mkdir", "-p", STAGE_DIR])

for phen in phen_suffix:
  with open(STAGE_DIR + "/" + phen + ".tsv", "w") as ofp:
    csv_ofp = csv.writer(ofp, delimiter='\t', lineterminator="\n")
    csv_ofp.writerow(phen_db_header[phen])
    for r in phen_db[phen]:
      csv_ofp.writerow(r)



phen = "demographics"
with open(STAGE_DIR + "/" + phen + ".tsv", "w") as ofp:
  csv_ofp = csv.writer(ofp, delimiter='\t', lineterminator="\n")
  csv_ofp.writerow(phen_db_header[phen])
  for r in phen_db[phen]:
    csv_ofp.writerow(r)




