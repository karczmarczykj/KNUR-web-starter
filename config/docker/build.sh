#!/bin/bash

# This script is intended to be run only inside a Docker container.
# It is used to build different versions of a webapp depending on the selected option.

WEBAPP_PATH="/home/node"
DIST_PATH="$WEBAPP_PATH/dist"
CERT_PATH="$DIST_PATH/certificates"
PACKAGE_PATH="/tmp/package"

# Function to display help
function show_help() {
  echo "Usage: $0 --type [production|test] --component [component]"
  echo "  --type: Required parameter. Must be 'production' or 'test'."
  echo "  --component: Required parameter. For example api_server."
}

function build_certs() {
  echo "Checking if certificates exist..."
  if [[ ( ! -d "$CERT_PATH" ) || ( -z "$(ls -A $CERT_PATH)" ) ]]; 
  then
    mkdir -p $CERT_PATH
    echo "Generating certificates..."
    npm run cert:generate
  fi 
  echo "Copying certificates from $CERT_PATH to $PACKAGE_PATH..."
  cp -a $CERT_PATH $PACKAGE_PATH/certificates
}

function build_webapp() {
  rm -fR node_modules 2>/dev/null || true
  set -e
  echo "Installing npm packages for build..."
  npm ci -y --include=dev --prefer-offline 
  echo "Building $2 component in $1 version..."
  if [ "$1" == "test" ]; then
    npm run build:test
  else
    npm run build:production
  fi

  echo "Copying artefacts from dist/$1/$2 to $PACKAGE_PATH/server..."
  mkdir -p $PACKAGE_PATH/server
  cp -a dist/$1/$2/* $PACKAGE_PATH/server
  mkdir -p $PACKAGE_PATH/content
  cp -a dist/$1/content/* $PACKAGE_PATH/content
}

function build() {
  mkdir -p $PACKAGE_PATH
  build_webapp $1 $2

  if [ "$1" == "production" ] ; then
    cp $WEBAPP_PATH/config/docker/server-config.test.yaml $PACKAGE_PATH/server-config.yaml
  else
    cp $WEBAPP_PATH/config/production/server-config.prod.yaml $PACKAGE_PATH/server-config.yaml
  fi

  cp $WEBAPP_PATH/config/docker/run.sh $PACKAGE_PATH
  cp $WEBAPP_PATH/package.json $PACKAGE_PATH
  cp $WEBAPP_PATH/package-lock.json $PACKAGE_PATH

  if [ "$1" != "production" ] ; then
    build_certs
  else
    echo "Copying certificates from $CERT_PATH to $PACKAGE_PATH..."
    cp -a config/production/certificates $PACKAGE_PATH/certificates
  fi

  chown -Rf node:node $PACKAGE_PATH
  rm -fR ./*
  mv $PACKAGE_PATH/* .
}

# Check the number of arguments
if [ "$#" -ne 4 ]; then
  echo "Error: Incorrect number of arguments $# \"$*.\""
  show_help
  exit 1
fi

# Check arguments
if [[  "$1" != "--type" && "$1" != "--component" ]]; then
  echo "Error: Unknown argument '$1' (full commad: \"$*.\")"
  show_help
  exit 1
else
  if [ "$1" == "--type" ]; then
    BUILD_TYPE=$2
    COMPONENT=$4
  fi
fi

if [[ "$3" != "--component" && "$3" != "--type" ]]; then
  echo "Error: Unknown argument '$3' (full command: \"$*.\")"
  show_help
  exit 1
else
  if [ "$3" == "--type" ]; then
    BUILD_TYPE=$4
    COMPONENT=$2
  fi
fi

# Validate the value of the --type parameter
if [[ "$BUILD_TYPE" != "production" && "$BUILD_TYPE" != "test" ]] ; then
  echo "Error: Invalid value for '--type' parameter (current value: $BUILD_TYPE)."
  show_help
  exit 1
fi

build $BUILD_TYPE $COMPONENT
