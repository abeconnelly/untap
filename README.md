untap
===

In order to facilitate ease of access, some of the information available through [Harvard Personal Genome Project](http://www.personalgenomes.org/) page and the [GET-Evidence](http://evidence.pgp-hms.org/about) site has been consolidated into a small SQLite database (~120Mb uncompressed).  This project is a collection of scripts to download data, consolidate into a SQLite database, upload to an [Arvados](https://arvados.org/) project and create an HTML visualization front end for easy exploration of the data.

You can explore the most recent snapshot of the Harvard Personal Genome Project database snapshot available through [a Curoverse hosted collection](http://curoverse.link/2210f7ee07fc1c8b926e5db28eff9635+3284/html/index.html).

Quick start
---

To grab the repository:

```bash
$ git clone https://github.com/abeconnelly/untap
$ cd untap
```

To download the database from `my.pgp-hms.org` and `evidence.pgp-hms.org` run:

```bash
$ ./public-database-dump
```

If you would like to upload to an [Arvados](https://arvados.org) project (requires an account on an Arvados system and appropriate config files):

```bash
$ ./upload-to-arvados
```

Installing the `html` directory in the appropriate place will allow you to see the visualization.  Care needs to be taken to make sure the SQLite database file gets copied over properly.

Visualization
---

Since the SQLite database is so small (~120Mb uncompressed) it can be loaded into the browser and explored directly.  There are a few canned visualizations, explanations of the SQLite schema and custom visualizations available.  Sometimes the database takes a while to load so please be patient if you don't immediately see any graphs in the `Summary`, `Variants` or `Custom` section.

### Summary Information Visualizations

![Age Summary](/img/age_summary.png)

This includes some canned summary statistics for the Harvard Personal Genome Project cohort, including age distribution, gender, ethnicity, etc

### Variant 

![Subject/Variant](/img/sub_var.png)

This shows a matrix of participants who have genomic data and variants.

### Custom

![Custom Visualization](/img/custom_viz.png)

This allows you to do your own custom queries.  There are some example queries that can be selected in the lower right hand corner.  

### Schema

![Schema](/img/schema_viz.png)

This page gives the schema for the SQLite database provided.

### Examples

![Schema](/img/schema_example_viz.png)

This page gives some simple queries that allow you to explore the underlying tables that exist in the SQLite database.

LICENSE
---

Source code is provided under AGPLv3.  All collected data from the Harvard Personal Genome Project is under CC0.
