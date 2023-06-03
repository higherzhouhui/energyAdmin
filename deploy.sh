#!/bin/bash
cd /home/www/literature-search-admin;
git pull origin;
echo "start install..."
yarn install;
echo "start build..."
yarn build;