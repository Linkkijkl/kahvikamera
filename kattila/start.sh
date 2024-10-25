#!/bin/bash

# Executes script with correct environment.

# Cd to this scripts containing directory
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR

# Run
source ../.venv/bin/activate
python3 kahvikamera.py

