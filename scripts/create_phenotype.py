#!/usr/bin/python
#
# Create a JSON file with all the (cleaned) pheontype
# data for participants in the 'hu.list' file.
#


import os
import re
import sys
import json
import subprocess as sp

FMT_LINES = "fmt_lines.py"

print "human_id\tdate\tphenotype_category\tphenotype"

def norm_ts(ts):
  m = re.match(r'^(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)', ts)
  if not m:
    return ts
  ye = int(m.group(3))
  mo = int(m.group(1))
  da = int(m.group(2))
  HO = int(m.group(4))
  MI = int(m.group(5))
  SE = int(m.group(6))
  v = "{:0>4d}-{:0>2d}-{:0>2d} {:0>2d}:{:0>2d}:{:0>2d}".format(ye, mo, da, HO, MI, SE)
  return v


huid_ts_phen = {}
phenotype = {}

SURV_DIR = "out-data/"

# The survey has a different format from the rest and will be treated
# specially.
#
fn_survey = SURV_DIR + "PGP_Participant_Survey.csv"

# These files have similar formats so are processed at once.
#
fn_trait = [ SURV_DIR + "PGP_Trait_Disease_Survey_2012_Blood.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Cancers.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Circulatory_System.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Congenital_Traits_and_Anomalies.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Digestive_System.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Endocrine_Metabolic_Nutritional_and_Immunity.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Genitourinary_Systems.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Musculoskeletal_System_and_Connective_Tissue.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Nervous_System.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Respiratory_System.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Skin_and_Subcutaneous_Tissue.csv",
SURV_DIR + "PGP_Trait_Disease_Survey_2012_Vision_and_hearing.csv" ]

fn_phenotype = [ SURV_DIR + "PGP_Basic_Phenotypes_Survey_2015.csv" ]


g_phenotype_class = {}


# Some fields span multiple lines, embedded in quotes.  fmt_lines.pl takes care of these
# fields, noticing when a line has a newline inside of a double quote.  It deletes
# the newline and puts the field element all on one line.
#
txt = sp.check_output( [FMT_LINES, fn_survey ] )
lines = txt.split("\n")
enum_phen = {}

phen_prefix = "Participant_Survey"

marked_survey_fields = { "Sex/Gender":1, "Race/ethnicity":1, "Month of birth":1, "Anatomical sex at birth":1, "Year of birth":1 }
skip_survey_fields = { "Do not touch!" : 1 }

header = True
survey_header = []
for l in lines:
  field = l.split("\t")
  if len(field)==0 or len(field)==1:
    continue

  field_huid,raw_ts,uuid,survey = field[0], field[1], field[2], field[3:]

  ts = norm_ts(raw_ts)

  if header:
    for i in range(len(survey)):
      survey_header.append( survey[i] )
    survey_header.append("none")
    header = False
    continue

  if field_huid not in huid_ts_phen:
    huid_ts_phen[field_huid] = {}

  if ts not in huid_ts_phen[field_huid]:
    huid_ts_phen[field_huid][ts] = { "huID": field_huid, "timestamp":ts }


  if len(survey) > len(survey_header):
    print "ERROR: survey length > survey_header length:", field_huid, ts, uuid, len(survey), len(survey_header)
    print survey_header
    print survey
    sys.exit(0)

  for i in range(len(survey)):
    enum_column = phen_prefix + ":" + survey_header[i]

    s_field = survey[i].strip(' ')

    if len(s_field)==0:
      continue

    #if survey_header[i] in marked_survey_fields:
    if survey_header[i] in skip_survey_fields:
      continue

    sh = survey_header[i]
    if re.search( r' [Yy]ears$', s_field ):
      sh = "Age"
    huid_ts_phen[field_huid][ts][ phen_prefix + ":" + sh ] = s_field

    print field_huid + "\t" + ts + "\t" + phen_prefix + ":" + sh + "\t" + s_field

    continue

# fn_trait file formats are of the form:
# HUID,Timestamp,UUID_CODE,EnumeratedType,FreeText
#  0      1          2          3           4
#

for fn in fn_trait:

  # Some fields span multiple lines, embedded in quotes.  fmt_lines.pl takes care of these
  # fields, noticing when a line has a newline inside of a double quote.  It deletes
  # the newline and puts the field element all on one line.
  #
  txt = sp.check_output( [ FMT_LINES, fn ] )
  lines = txt.split("\n")

  enum_phen = {}
  phen_prefix = re.sub( r'^.*PGP_Trait_Disease_Survey_2012_(.*)\.csv', r'\1', fn )

  header = True
  for l in lines:
    field = l.split("\t")

    # skip interpreting the header
    #
    if header:
      header = False
      continue

    if len(field)!=5:
      if len(field)>1:
        pass
      continue


    field_huid,raw_ts,uuid,enum_type,freetext = field

    ts = norm_ts(raw_ts)

    if field_huid not in huid_ts_phen:
      huid_ts_phen[field_huid] = {}

    if ts not in huid_ts_phen[field_huid]:
      huid_ts_phen[field_huid][ts] = { "huID": field_huid, "timestamp":ts }

    # Some fields have extra commas in them so we have to take special
    # consideration.
    #

    # replace commas with '%2C' (url-code for comma) when a comma appears
    # inside of a parenthsis string.
    #
    # For example:
    #
    #  Chronic tension headaches (15+ days per month, at least 6 months)
    #
    # will be replaced with:
    #
    #  Chronic tension headaches (15+ days per month%2C at least 6 months)
    #
    et_csv = re.sub( r'(\([^\)]*),([^\)]*\))', r'\1%2C\2', enum_type )

    # Diabetes mellitus has different types, indicated 'type [12]' (maybe more,
    # I've only observed 1 and 2) seperated by a comma.
    # For example "Daiabetes mellitus, type 1".
    #
    # Replace the prefix comma for 'type' with url encoded '%2C'.
    #
    et_csv = re.sub( r'Diabetes mellitus, type', r'Diabetes mellitus%2C type', et_csv)

    et_csv = re.sub( r'Infantile, juvenile, and presenile cataract', r'Infantile%2C juvenile%2C and presenile cataract', et_csv)

    for et in et_csv.split(","):
      et = et.strip(' ')
      if len(et) > 0:
        print field_huid + "\t" + ts + "\t" + phen_prefix + "\t" + et

    tt = freetext.strip(' ')
    if len(tt) > 0:
      print field_huid + "\t" + ts + "\t" + phen_prefix + ":other\t" + tt

pheno_header = {}
for fn in fn_phenotype:

  # Some fields span multiple lines, embedded in quotes.  fmt_lines.pl takes care of these
  # fields, noticing when a line has a newline inside of a double quote.  It deletes
  # the newline and puts the field element all on one line.
  #
  txt = sp.check_output( [ FMT_LINES, fn ] )
  lines = txt.split("\n")

  enum_phen = {}

  phen_prefix = re.sub( r'^.*PGP_(.*)_Survey_\d+.*\.csv', r'\1', fn )

  header = True
  for l in lines:
    field = l.split("\t")

    # skip interpreting the header
    #
    if header:
      header = False

      for k,v in enumerate(field[3:]):
        header_field = re.sub( r'^\s*\d+\.\d+\s*[^\sa-zA-Z0-9]*\s*', '', v)
        pheno_header[k] = header_field
      continue

    if len(field)<3:
      continue

    field_huid = field[0]
    raw_ts = field[1]
    uuid = field[2]

    ts = norm_ts(raw_ts)

    if field_huid not in huid_ts_phen:
      huid_ts_phen[field_huid] = {}

    if ts not in huid_ts_phen[field_huid]:
      huid_ts_phen[field_huid][ts] = { "huID": field_huid, "timestamp":ts }

    for enum_pos, enum_type in enumerate(field[3:]):

      enum_type = enum_type.strip(' ')
      if len(enum_type) == 0:
        continue

      # Some fields have extra commas in them so we have to take special
      # consideration.
      #

      # replace commas with '%2C' (url-code for comma) when a comma appears
      # inside of a parenthsis string.
      #
      # For example:
      #
      #  Chronic tension headaches (15+ days per month, at least 6 months)
      #
      # will be replaced with:
      #
      #  Chronic tension headaches (15+ days per month%2C at least 6 months)
      #
      et_csv = re.sub( r'(\([^\)]*),([^\)]*\))', r'\1%2C\2', enum_type )

      for et in et_csv.split(","):
        et = et.strip(' ')
        if len(et) > 0:
          print field_huid + "\t" + ts + "\t" + phen_prefix + ":" + pheno_header[enum_pos] + "\t" + et

