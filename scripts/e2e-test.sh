#!/bin/bash
SRC_PATH=$1
CUSTOM_COMMAND="${2:-yarn test}"

# setting up child integration test link to gatsby packages
cd $SRC_PATH &&
sh -c "$CUSTOM_COMMAND" &&
echo "e2e test run succeeded"