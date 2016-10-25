#!/bin/bash

nohup python Collect.py 3 &
nohup python Collect.py 1 &
nohup python Collect.py 2 &
ehco "Done" &

sleep 10