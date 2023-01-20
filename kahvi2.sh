#!/bin/sh

sleep 30
killall ffmpeg
ffmpeg -y -f video4linux2 -i /dev/video0 -q:v 1 -vframes 1 ~/kahvikamera/kuva.jpg
# scp -P 52222 ~/kahvikamera.jpg kahvikamera@loota.xyz:~/kahvikamera.jpg

# koneelle oma githubkäyttäjä?
git commit -am "kuva kahvi_pannusta `date`"
git push
