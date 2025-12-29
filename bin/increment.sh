#!/bin/bash

next_version=$1
path='src/metadata.json'
new_json="$(jq -r '.KPlugin.Version = "'$next_version'"' $path)"
echo "$new_json" >$path
