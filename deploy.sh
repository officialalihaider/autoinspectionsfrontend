#!/bin/bash
# ===========================================
# AutoGemz Full Deployment Script
# Frontend + Backend
# ===========================================

echo "🚀 Starting full deploy..."

# --------- Backend ---------
echo "📦 Deploying Backend..."
cd ~/autoinspectionsbackend || { echo "Backend folder not found"; exit 1; }
git pull origin main
npm install
pm2 restart autoinspections --update-env
echo "✅ Backend deployed!"

# --------- Frontend ---------
echo "🌐 Deploying Frontend..."
cd ~/autoinspectionsfrontend || { echo "Frontend folder not found"; exit 1; }
git pull origin main
npm install
npm run build

# Copy build folder to nginx root
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
echo "✅ Frontend deployed!"

echo "🎉 Full deployment finished!"
