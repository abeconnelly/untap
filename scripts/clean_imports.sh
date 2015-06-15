#!/bin/bash

for tsv in `ls *.tsv`
do
  echo $tsv
  dos2unix $tsv
done
