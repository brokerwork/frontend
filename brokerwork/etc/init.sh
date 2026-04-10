#!/bin/sh

git clone git@103.6.128.106:ui/fooui.git
git clone git@103.6.128.106:ui/brokerwork.git

main_dir=`pwd`

cd fooui
npm install
sudo npm link

cd $main_dir
cd brokerwork
npm install
sudo npm link fooui