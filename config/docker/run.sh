#!/bin/bash

# This script is intended to be run only inside a Docker container.
# It is used to build different versions of a webapp depending on the selected option.

node ./server/main.cjs
