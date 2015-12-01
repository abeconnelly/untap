#!/usr/bin/python

import re
import csv
import sys

if len(sys.argv)<2:
  print "provide file"
  sys.exit(0)



if sys.argv[1] == "-":
  fp = sys.stdin
else:
  fp = open(sys.argv[1])


header_count = 0
overflow = False
cur_count=0
cur_row = []

reader = csv.reader(fp, delimiter=',')
for row in reader:
  if header_count==0:
    header_count = len(row)

  cur_count+=len(row)

  for r in row:
    z = re.sub("\n", "\\\\n", r)
    z = re.sub("\t", "\\\\t", z)
    cur_row.append(z)
    # Some fields start with a double quotes so we have to take special
    # consideration.
    #
    # For example:
    #
    #   "Swimmers' shoulder"- rotator cuff tendonitis/ biceps tendonitis
    #
    # will be replaced with
    #
    #   """Swimmers'' shoulder""- rotator cuff tendonitis/ biceps tendonitis"
    #

  if cur_count!=header_count:
    overflow = True
  else:
    overflow =False

    print "\t".join(cur_row)

    cur_count=0
    cur_row = []

