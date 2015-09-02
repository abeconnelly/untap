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

We need to run the application inside a server such as nginx.

```bash
$ sudo apt-get install nginx
$ sudo /etc/init.d/nginx start
$ mkdir /var/www
$ sudo vi /etc/nginx/sites-enabled/untap
	server {
	  root /var/www;

	  location / {
	  }
	}
$ sudo ln -s /home/nrw/projects/untap /var/www/untap
$ sudo chmod -R 777 /var/www/untap
$ sudo nginx -s reloadu
```

Now we need to obtain a dataset. Either 1) download the snapshot provided at [the Untap hosted on Curoverse](http://curoverse.link/2210f7ee07fc1c8b926e5db28eff9635+3284/html/index.html) or 2) follow the instructions in the following section to scrape [Tapestry](http://my.pgp-hms.org) and build your own snapshot. In both cases, the database should be put in the root directory, i.e. `/untap/hu-pgp.sqlite3.gz`. 

Now if you go to [Untap.html](./html/untap.html) you should see the application running and tabs such as "Summary" should show graphs when you select a dropdown option (e.g. "allergies"). 

Updating the Database
---

The Quick start uses a static dump of the database and may not be up-to-date. To re-scrape all the data yourself for a more up-to-date copy, see the following instructions.

You may need several dependencies if they're not installed already.

```bash
$ sudo apt-get install jq
$ sudo add-apt-repository -y ppa:ethereum/ethereum
$ sudo apt-get install golang
$ mkdir -p ~/go; echo "export GOPATH=$HOME/go" >> ~/.bashrc
$ echo "export PATH=$PATH:$HOME/go/bin:/usr/local/go/bin" >> ~/.bashrc
$ source ~/.bashrc
$ go get github.com/ericchiang/pup
$ sudo apt-get install parallel
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

Guided Walkthrough
---
For a guided walkthrough of how to use this application, see [Introduction](./Introduction.md). 

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
