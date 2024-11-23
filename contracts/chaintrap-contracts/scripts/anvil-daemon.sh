#!/bin/bash
# go-task doesn't do background jobs
NAME=$1
shift
anvil $@ > $NAME.log &
PID=$!
echo $PID > $NAME.pid