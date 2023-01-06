#!/bin/bash

sudo kill -9 $(sudo lsof -t -i:80)
serve build --single -p 80 1> /dev/null 2> /dev/null &