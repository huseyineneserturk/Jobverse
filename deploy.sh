#!/bin/bash

# Jobverse Deployment Script for DigitalOcean
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Jobverse Deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
APP_DIR="/root/Jobverse"
DOMAIN="jobverse.tech"
API_DOMAIN="api.jobverse.tech"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Node.js 18
echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2
echo -e "${YELLOW}📦 Installing PM2...${NC}"
npm install -g pm2

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
apt install -y nginx

# Install Certbot
echo -e "${YELLOW}📦 Installing Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# Create logs directory
mkdir -p /root/logs

# Clone or pull repository
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
    cd $APP_DIR
    git pull origin main
else
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    git clone https://github.com/huseyineneserturk/Jobverse.git $APP_DIR
    cd $APP_DIR
fi

# Backend setup
echo -e "${YELLOW}🔧 Setting up Backend...${NC}"
cd $APP_DIR/jobverse-backend
npm install
npm run build

# Frontend setup
echo -e "${YELLOW}🔧 Setting up Frontend...${NC}"
cd $APP_DIR/jobverse-frontend
npm install
npm run build

# Copy nginx config
echo -e "${YELLOW}🔧 Configuring Nginx...${NC}"
cp $APP_DIR/nginx.conf /etc/nginx/sites-available/jobverse
ln -sf /etc/nginx/sites-available/jobverse /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

# Get SSL certificates
echo -e "${YELLOW}🔒 Getting SSL certificates...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN -d $API_DOMAIN --non-interactive --agree-tos -m your-email@example.com

# Start backend with PM2
echo -e "${YELLOW}🚀 Starting Backend with PM2...${NC}"
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Restart Nginx
systemctl restart nginx

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}🌐 Frontend: https://$DOMAIN${NC}"
echo -e "${GREEN}🔌 API: https://$API_DOMAIN${NC}"
