-- deprecated, see untap-db.sql instead
CREATE TABLE survey (
  id integer primary key,
  human_id varchar(255),
  date datetime,
  phenotype_category varchar(255),
  phenotype varchar(255)
);
CREATE INDEX survey_huid_idx on survey (human_id);
CREATE INDEX survey_date_idx on survey (date);
CREATE INDEX survey_phenotype_category_idx on survey (phenotype_category);
CREATE INDEX survey_phenotype_idx on survey (phenotype);
CREATE TABLE test_results (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  result varchar(255),
  date varchar(255)
);
CREATE INDEX test_results_idx on test_results(human_id);
CREATE TABLE allergies (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  severity varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
CREATE INDEX allergies_idx on allergies(human_id);
CREATE TABLE conditions (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
CREATE INDEX conditions_idx on conditions(human_id);
CREATE TABLE demographics (
  id integer primary key,
  human_id varchar(255),
  date_of_birth varchar(255),
  gender varchar(255),
  weight varchar(255),
  height varchar(255),
  blood_type varchar(255),
  race varchar(255)
);
CREATE INDEX demographics_idx on demographics(human_id);
CREATE TABLE immunizations (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  date varchar(255)
);
CREATE INDEX immunizations_idx on immunizations(human_id);
CREATE TABLE medications (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  dosage varchar(255),
  frequency varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
CREATE INDEX medications_idx on medications(human_id);
CREATE TABLE procedures (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  date varchar(255)
);
CREATE INDEX procedures_idx on procedures(human_id);
CREATE TABLE uploaded_data (
  id integer primary key,
  human_id varchar(255),
  date varchar(255),
  data_type varchar(255),
  source varchar(255),
  name varchar(255),
  download_description varchar(255),
  download_url varchar(255),
  report_description varchar(255),
  report_url varchar(255)
);
CREATE INDEX uploaded_data_idx on uploaded_data(human_id);
CREATE TABLE suff_record (
  id integer primary key,
  json_record  varchar(255)
);
CREATE INDEX suff_record_idx on suff_record (json_record);
CREATE TABLE insuff_record (
  id integer primary key,
  json_record  varchar(255)
);
CREATE INDEX insuff_record_idx on insuff_record (json_record);
CREATE TABLE human_suff_record_map (
  id integer primary key,
  uploaded_data_id integer,
  suff_record_index integer
);
CREATE INDEX human_suff_record_idx on human_suff_record_map (uploaded_data_id);
CREATE INDEX human_suff_record_2_idx on human_suff_record_map (suff_record_index);
CREATE TABLE human_insuff_record_map (
  id integer primary key,
  uploaded_data_id integer,
  insuff_record_index integer
);
CREATE INDEX human_insuff_record_idx on human_insuff_record_map (uploaded_data_id);
CREATE INDEX human_insuff_record_2_idx on human_insuff_record_map (insuff_record_index);

CREATE TABLE enrollment_date (
  id integer primary key,
  human_id varchar(255),
  enrollment_date varchar(255)
);
CREATE INDEX enrollment_date_human_id on enrollment_date (human_id);
CREATE INDEX enrollment_date_enrollment_date on enrollment_date (enrollment_date);
