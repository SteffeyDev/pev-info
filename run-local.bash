#!/usr/bin/env bash

source setenv.sh

parse-server --appId $APPLICATION_ID --clientKey $CLIENT_KEY --masterKey $MASTER_KEY --databaseURI mongodb://localhost/vehicles