#!/bin/bash
docker build -t presalemint . && docker run -p 8085:80 presalemint
