
-- human locator pairs

/*

-- data soley in uploaded_data

drop table if exists human_record_locator;
create table human_record_locator (
  id integer primary key,
  human_id varchar(255),
  locator varchar(255)
);
.separator "\t"
.import "human-report-map.tsv" human_record_locator

create index human_record_locator_huid_idx on human_record_locator (human_id);
create index human_record_locator_loc_idx on human_record_locator (locator);
create index human_record_locator_huid_loc_idx on human_record_locator (human_id, locator);
*/


-- sufficient records

drop table if exists suff_record;
create table suff_record (
  id integer primary key,
  json_record  varchar(255)
);
.separator "\t"
.import "ge-suff.tsv" suff_record

create index suff_record_idx on suff_record (json_record);


-- insufficient records

drop table if exists insuff_record;
create table insuff_record (
  id integer primary key,
  json_record  varchar(255)
);
.separator "\t"
.import "ge-insuff.tsv" insuff_record

create index insuff_record_idx on insuff_record (json_record);



-- sufficient record map

drop table if exists human_suff_record_map;
create table human_suff_record_map (
  id integer primary key,
  uploaded_data_id integer,
  suff_record_index integer
);
drop table if exists foo;
create table foo (
  uploaded_data_id integer,
  suff_record_index integer
);
.separator "\t"
.import "ge-suff-hu-map.tsv" foo
insert into human_suff_record_map(uploaded_data_id, suff_record_index) select uploaded_data_id, suff_record_index from foo where uploaded_data_id != 'uploaded_data_id';
drop table foo;


-- .separator "\t"
-- .import "ge-suff-hu-map.tsv" human_suff_record_map

create index human_suff_record_idx on human_suff_record_map (uploaded_data_id);
create index human_suff_record_2_idx on human_suff_record_map (suff_record_index);



-- insufficient record map

drop table if exists human_insuff_record_map;
create table human_insuff_record_map (
  id integer primary key,
  uploaded_data_id integer,
  insuff_record_index integer
);

drop table if exists foo;
create table foo (
  uploaded_data_id integer,
  insuff_record_index integer
);
.separator "\t"
.import "ge-insuff-hu-map.tsv" foo
insert into human_insuff_record_map(uploaded_data_id, insuff_record_index) select uploaded_data_id, insuff_record_index from foo;
drop table foo;

create index human_insuff_record_idx on human_insuff_record_map (uploaded_data_id);
create index human_insuff_record_2_idx on human_insuff_record_map (insuff_record_index);
