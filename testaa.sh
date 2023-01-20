#!/bin/sh

ffmpeg -y -f video4linux2 -i /dev/video0 -q:v 1 -vframes 1 ~/kahvikameratest.jpg
