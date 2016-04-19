#!/usr/bin/python

import subprocess as sp
import sys
import json
import re
import csv
import os

debug=False
header=False

URL="https://my.pgp-hms.org"

if len(sys.argv)<2:
    print "provide HTML file to parse"
    sys.exit(1)
fn = sys.argv[1]
if debug: print "# processing:", fn

if len(sys.argv)<3:
    print "provide huID"
    sys.exit(1)
huid = sys.argv[2]



with open(fn) as ifp:
    #ifp = open(fn)
    pup_json = json.loads(sp.check_output(['pup', 'h3:contains("Samples") + div table tbody json{}'], stdin=ifp))


ready = False
CollectionEvent = []
curEvent = {}
curEvent["human_id"] = huid
curEvent["log"] = []

#.[0].children[].children[0].children

if len(pup_json) == 0:
    sys.exit(0)

data = pup_json[0]["children"]
for x in data:
    z = x["children"][0]

    tag = z["tag"]

    if tag == "th":
        h = z["children"][0]
        txt = h["text"]
        href = h["href"]


        if ready:
            CollectionEvent.append(curEvent)
            curEvent = {}
            curEvent["human_id"] = huid
            curEvent["log"] = []
        ready = True

        curEvent["href"] = URL + href
        curEvent["text"] = txt


        if debug: print "+++", href, txt
    else:
        description = re.sub(r'\s+', ' ', z["text"]).strip()

        curEvent["description"] = description

        ens = z["children"][1]["children"][0]["children"][0]["children"]

        if debug: print ">>>", description
        for en in ens:

            en_date = ""
            en_value = ""
            en_descr = ""

            if "children" not in en:
                continue
            row = en["children"]

            if (len(row)>0) and ("text" in row[0]):
                en_date  = row[0]["text"]
            if (len(row)>1) and ("text" in row[1]):
                en_value = row[1]["text"]
            if (len(row)>2) and ("text" in row[2]):
                en_descr = row[2]["text"]

            #en_date  = en["children"][0]["text"]
            #en_value = en["children"][1]["text"]
            #en_descr = en["children"][2]["text"]

            curEvent["log"].append( { "date" : en_date, "value" : en_value, "description" : en_descr })

            if debug: print ">>>", en_date, ":", en_value, ":", en_descr

    continue

CollectionEvent.append(curEvent)

if debug: print json.dumps(CollectionEvent)

writer = csv.writer(sys.stdout, delimiter='\t', lineterminator="\n")
if header:
    writer.writerow([ "human_id", "href", "text", "description", "log_date", "log_text", "log_description" ])
for ev in CollectionEvent:
    for log in ev["log"]:
        writer.writerow([ ev["human_id"], ev["href"], ev["text"], ev["description"], log["date"], log["value"], log["description"] ])
