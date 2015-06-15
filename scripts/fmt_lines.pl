#!/usr/bin/perl
#

my $fn = ($ARGV[0] || die "provide filename");

my $overflow=0;

open FH, $fn;
while (<FH>) {
  my $l = $_;
  chomp($l);

  $l =~ s/""/\%22/g;
  $l =~ s/\t/  /g;

  print $l;

  if (($overflow==1) && ($l=~/^[^"]*",/)) {
    $overflow=0;
  }

  if (($overflow==1) && ($l=~/^[^"]*"$/)) {
    $overflow=0;
  }

  if ($l=~/,"[^"]*$/) {
    $overflow=1;
  }

  if ($overflow==0) {
    print "\n";
  }

}
close FH;
