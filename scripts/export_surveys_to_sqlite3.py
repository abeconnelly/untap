#!/usr/bin/python
#

import os
import sys
import sqlite3
import csv

OUT_SQLITE3_DB = "./untap.db"
TSV_DIR = "."
HAS_HEADER = True

#OUT_SQLITE3_DB = "../out-data/untap.db"
#TSV_DIR = "../out-data"

if len(sys.argv)>1:
  OUT_SQLITE3_DB = sys.argv[1]

if len(sys.argv)>2:
  TSV_DIR = sys.argv[2]

tables = {}
tables["survey"] = {}
tables["survey"]["name"] = [ "id", "human_id", "date", "phenotype_category", "phenotype" ]
tables["survey"]["type"] = [ "integer primary key", "varchar(255)", "datetime", "varchar(255)", "varchar(255)" ]
tables["survey"]["idx"] = [ "create index survey_huid_idx on survey (human_id)",
    "create index survey_date_idx on survey (date)",
    "create index survey_phenotype_category_idx on survey (phenotype_category)",
    "create index survey_phenotype_idx on survey (phenotype)"]

tables["test_results"] = {}
tables["test_results"]["name"] = ["id", "human_id", "name", "result", "date"]
tables["test_results"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["test_results"]["idx"] = [ "create index test_results_idx on test_results(human_id)"]

tables["allergies"] = {}
tables["allergies"]["name"] = ["id", "human_id", "name", "severity", "start_date", "end_date"]
tables["allergies"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["allergies"]["idx"] = ["create index allergies_idx on allergies(human_id)"]

tables["conditions"] = {}
tables["conditions"]["name"] = ["id", "human_id", "name", "start_date", "end_date"]
tables["conditions"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["conditions"]["idx"] = ["create index conditions_idx on conditions(human_id)"]

tables["demographics"] = {}
tables["demographics"]["name"] = ["id", "human_id", "date_of_birth", "gender", "weight", "height", "blood_type", "race"]
tables["demographics"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["demographics"]["idx"] = ["create index demographics_idx on demographics(human_id)"]

tables["immunizations"] = {}
tables["immunizations"]["name"] = ["id", "human_id", "name", "date"]
tables["immunizations"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["immunizations"]["idx"] = ["create index immunizations_idx on immunizations(human_id)"]

tables["medications"] = {}
tables["medications"]["name"] = ["id", "human_id", "name", "dosage", "frequency", "start_date", "end_date"]
tables["medications"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["medications"]["idx"] = ["create index medications_idx on medications(human_id)"]

tables["procedures"] = {}
tables["procedures"]["name"] = ["id", "human_id", "name", "date"]
tables["procedures"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["procedures"]["idx"] = ["create index procedures_idx on procedures(human_id)"]

tables["uploaded_data"] = {}
tables["uploaded_data"]["name"] = ["id", "human_id", "date", "data_type", "source", "name", "download_description", "download_url", "report_description", "report_url"]
tables["uploaded_data"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)", "varchar(255)"]
tables["uploaded_data"]["idx"] = ["create index uploaded_data_idx on uploaded_data(human_id)"]

tables["enrollment_date"] = {}
tables["enrollment_date"]["name"] = ["id", "human_id", "enrollment_date"]
tables["enrollment_date"]["type"] = ["integer primary key", "varchar(255)", "varchar(255)"]
tables["enrollment_date"]["idx"] = ["create index enrollment_date_human_idx on enrollment_date (human_id)"]


def populate_table(curs, table, fn):
  curs.execute("drop table if exists " + table)
  creat = "create table " + table + "("
  xx = []
  yy = []
  for i,field in enumerate(tables[table]["name"]):
    xx.append( field + " " + tables[table]["type"][i])
    if i>0:
      yy.append(field)
  creat += ",".join(xx)
  creat += ")"
  curs.execute(creat)

  qq = "(?" + ",?"*(len(tables[table]["name"])-2) + ")"
  ff = "(" + ",".join(yy) + ")"

  with open(fn, "r") as fp:
    csvreader = csv.reader(fp, delimiter="\t")
    count = 0
    for row in csvreader:
      count += 1
      if HAS_HEADER and count == 1:
        continue
      irow = []
      for i,v in enumerate(row):
        irow.append(v)
      curs.execute("insert into " + table + " " + ff + " values " + qq, irow)

conn = sqlite3.connect(OUT_SQLITE3_DB)
conn.text_factory = str
curs = conn.cursor()

for table in tables:
  ifn = TSV_DIR + "/" + table + ".tsv"
  populate_table(curs, table, ifn)

conn.commit()
