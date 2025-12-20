#!/bin/bash

# =====================================================
# JOBVERSE - Digital Ocean Otomatik Kurulum Scripti
# Domain: jobverse.tech
# =====================================================

set -e

echo "========================================"
echo "🚀 JOBVERSE DEPLOY BAŞLIYOR"
echo "========================================"

# Renk tanımları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Sistem Güncelleme
echo -e "\n${YELLOW}[1/9] Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y

# 2. Node.js 18 Kurulumu
echo -e "\n${YELLOW}[2/9] Node.js 18 kuruluyor...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
echo -e "${GREEN}✓ Node.js $(node -v) kuruldu${NC}"

# 3. PM2 Kurulumu
echo -e "\n${YELLOW}[3/9] PM2 kuruluyor...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 kuruldu${NC}"

# 4. Nginx Kurulumu
echo -e "\n${YELLOW}[4/9] Nginx kuruluyor...${NC}"
apt install -y nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx kuruldu${NC}"

# 5. Certbot Kurulumu
echo -e "\n${YELLOW}[5/9] Certbot kuruluyor...${NC}"
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✓ Certbot kuruldu${NC}"

# 6. Projeyi Klonla
echo -e "\n${YELLOW}[6/9] Proje klonlanıyor...${NC}"
cd /root
if [ -d "Jobverse" ]; then
    echo "Mevcut Jobverse klasörü siliniyor..."
    rm -rf Jobverse
fi
git clone https://github.com/huseyineneserturk/Jobverse.git
cd Jobverse
echo -e "${GREEN}✓ Proje klonlandı${NC}"

# 7. Logs klasörü
mkdir -p /root/logs

# 8. Nginx Yapılandırması (SSL olmadan önce)
echo -e "\n${YELLOW}[7/9] Nginx yapılandırılıyor...${NC}"
cat > /etc/nginx/sites-available/jobverse << 'NGINX_CONF'
# API Backend
server {
    listen 80;
    server_name api.jobverse.tech;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
    }
}

# Frontend
server {
    listen 80;
    server_name jobverse.tech www.jobverse.tech;
    
    root /root/Jobverse/jobverse-frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/jobverse /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx
echo -e "${GREEN}✓ Nginx yapılandırıldı${NC}"

# 9. Firewall
echo -e "\n${YELLOW}[8/9] Firewall ayarlanıyor...${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
echo "y" | ufw enable
echo -e "${GREEN}✓ Firewall aktif${NC}"

echo -e "\n${YELLOW}[9/9] Bağımlılıklar yükleniyor...${NC}"
# Backend
cd /root/Jobverse/jobverse-backend
npm install

# Frontend
cd /root/Jobverse/jobverse-frontend
npm install

echo ""
echo "========================================"
echo -e "${GREEN}✅ TEMEL KURULUM TAMAMLANDI!${NC}"
echo "========================================"
echo ""
echo "SONRAKİ ADIMLAR:"
echo ""
echo "1. Backend .env dosyasını oluştur:"
echo "   nano /root/Jobverse/jobverse-backend/.env"
echo ""
echo "2. Frontend .env dosyasını oluştur:"
echo "   nano /root/Jobverse/jobverse-frontend/.env"
echo ""
echo "3. Build ve başlat:"
echo "   cd /root/Jobverse/jobverse-backend && npm run build"
echo "   cd /root/Jobverse/jobverse-frontend && npm run build"
echo "   cd /root/Jobverse && pm2 start ecosystem.config.js"
echo "   pm2 save && pm2 startup"
echo ""
echo "4. SSL sertifikası al:"
echo "   certbot --nginx -d jobverse.tech -d www.jobverse.tech -d api.jobverse.tech"
echo ""
echo "========================================"
