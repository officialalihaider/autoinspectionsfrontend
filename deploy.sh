#!/bin/bash

cd /home/ubuntu/autoinspectionsfrontend

echo "Pulling latest code..."
git pull origin main

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Deploying to nginx..."
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

echo "Restarting nginx..."
sudo systemctl restart nginx

echo "Deployment finished!"

