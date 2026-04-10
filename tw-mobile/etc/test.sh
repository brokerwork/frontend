#!/usr/bin/env bash
: "
  echo hello
"
BOOT_RELEASE_DIR=/mnt/boot-release/ta-ui
INNER_VERSION_PREFIX=
INTERNAL_VERSION_OR_TAG=5.0.2
# internal version : $prefix+$buildnumber
INTERNAL_VERSION=$INNER_VERSION_PREFIX.$BUILD_NUMBER

if [ ! -z $INNER_VERSION_PREFIX ] ; then
	echo $INNER_VERSION_PREFIX
else
	echo 'empty'
fi
# if [[ $INTERNAL_VERSION_OR_TAG =~ ^5\.0\.[0-9]*$ ]] ; then
#   echo '5.0.x'
# elif [ $INTERNAL_VERSION_OR_TAG = "latest" ] ; then
#   echo "lastst"
# fi