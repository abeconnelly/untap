drop table if exists foo;

-- survey

drop table if exists survey;
create table survey (
  id integer primary key,
  human_id varchar(255),
  date datetime,
  phenotype_category varchar(255),
  phenotype varchar(255)
);

create table foo (
  human_id varchar(255),
  date datetime,
  phenotype_category varchar(255),
  phenotype varchar(255)
);

.separator "\t"
-- .import "out-data/survey.tsv" foo
.import "survey.tsv" foo
insert into survey (
  human_id,
  date,
  phenotype_category,
  phenotype
)
select
  human_id,
  date,
  phenotype_category,
  phenotype
from foo where human_id != 'human_id';
drop table foo;

create index survey_huid_idx on survey (human_id);
create index survey_date_idx on survey (date);
create index survey_phenotype_category_idx on survey (phenotype_category);
create index survey_phenotype_idx on survey (phenotype);



-- test_results

drop table if exists test_results;
create table test_results (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  result varchar(255),
  date varchar(255)
);

create index test_results_idx on test_results(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  name varchar(255),
  result varchar(255),
  date varchar(255)
);
.separator "\t"
.import test_results.tsv foo
insert into test_results(human_id, name, result, date) select foo.human_id, foo.name, foo.result, foo.date from foo where human_id != 'human_id';



-- allergies

drop table if exists allergies;
create table allergies (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  severity varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);

create index allergies_idx on allergies(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  name varchar(255),
  severity varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
.separator "\t"
.import allergies.tsv foo
insert into allergies(human_id, name, severity, start_date, end_date) select human_id, name, severity, start_date, end_date from foo where human_id != 'human_id';


-- conditions

drop table if exists conditions;
create table conditions (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);

create index conditions_idx on conditions(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  name varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
.separator "\t"
.import conditions.tsv foo
insert into conditions(human_id, name, start_date, end_date) select human_id, name, start_date, end_date from foo where human_id != 'human_id';



-- demographics

drop table if exists demographics;
create table demographics (
  id integer primary key,
  human_id varchar(255),
  date_of_birth varchar(255),
  gender varchar(255),
  weight varchar(255),
  height varchar(255),
  blood_type varchar(255),
  race varchar(255)
);

create index demographics_idx on demographics(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  date_of_birth varchar(255),
  gender varchar(255),
  weight varchar(255),
  height varchar(255),
  blood_type varchar(255),
  race varchar(255)
);
.separator "\t"
.import demographics.tsv foo
insert into demographics(human_id, date_of_birth, gender, weight, height, blood_type, race) select human_id, date_of_birth, gender, weight, height, blood_type, race from foo where human_id != 'human_id';

-- immunizations

drop table if exists immunizations;
create table immunizations (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  date varchar(255)
);

create index immunizations_idx on immunizations(human_id);

drop table if exists foo;
create table foo (
  human_id varhcar(255),
  name varchar(255),
  date varchar(255)
);
.separator "\t"
.import immunizations.tsv foo
insert into immunizations(human_id, name, date) select human_id, name, date from foo where human_id != 'human_id';


-- medications

drop table if exists medications;
create table medications (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  dosage varchar(255),
  frequency varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);

create index medications_idx on medications(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  name varchar(255),
  dosage varchar(255),
  frequency varchar(255),
  start_date varchar(255),
  end_date varchar(255)
);
.separator "\t"
.import medications.tsv foo
insert into medications(human_id, name, dosage, frequency, start_date, end_date) select  human_id, name, dosage, frequency, start_date, end_date from foo where human_id != 'human_id';


-- procedures

drop table if exists procedures;
create table procedures (
  id integer primary key,
  human_id varchar(255),
  name varchar(255),
  date varchar(255)
);

create index procedures_idx on procedures(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  name varchar(255),
  date varchar(255)
);
.separator "\t"
.import procedures.tsv foo
insert into procedures(human_id, name, date) select human_id, name, date from foo where human_id != 'human_id';

-- uploaded data

drop table if exists uploaded_data;
create table uploaded_data (
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

create index uploaded_data_idx on uploaded_data(human_id);

drop table if exists foo;
create table foo (
  human_id varchar(255),
  date varchar(255),
  data_type varchar(255),
  source varchar(255),
  name varchar(255),
  download_description varchar(255),
  download_url varchar(255),
  report_description  varchar(255),
  report_url varchar(255)
);
.separator "\t"
.import uploaded_data.tsv foo
insert into uploaded_data(human_id, date, data_type, source, name, download_description, download_url, report_description, report_url) select human_id, date, data_type, source, name, download_description, download_url, report_description, report_url from foo where human_id != 'human_id';

-- enrollment_date

drop table if exists enrollment_date;
CREATE TABLE enrollment_date (
   id integer primary key,
   human_id varchar(255),
   enrollment_date varchar(255)
 );
CREATE INDEX enrollment_date_human_id on enrollment_date (human_id);
CREATE INDEX enrollment_date_enrollment_date on enrollment_date (enrollment_date);

drop table if exists foo;

create table foo (
  human_id varchar(255),
  enrollment_date varchar(255)
);

.separator ","
.import enrollmentdate.csv foo
insert into enrollment_date(human_id, enrollment_date) select human_id, enrollment_date from foo where human_id != 'human_id';


-- specimens

drop table if exists specimens;
CREATE TABLE specimens (
  id integer primary key,
  human_id varchar(255),
  crc_id varchar(255),
  amount varchar(255),
  material varchar(255),
  owner_researcher_affiliation varchar(255),
  study_name varchar(255),
  unit varchar(255)
);
CREATE INDEX specimens_human_id on specimens (human_id);
CREATE INDEX specimens_crc_id on specimens (crc_id);

drop table if exists foo;

create table foo (
  human_id varchar(255),
  crc_id varchar(255),
  amount varchar(255),
  material varchar(255),
  owner_researcher_affiliation varchar(255),
  study_name varchar(255),
  unit varchar(255)
);

.separator ","
.import enrollmentdate.csv foo
insert into specimens(human_id, crc_id, amount, material, owner_researcher_affiliation, study_name, unit)
  select human_id, crc_id, amount, material, owner_researcher_affiliation, study_name, unit
  from foo
  where human_id != 'human_id';
