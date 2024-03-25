#!/bin/bash

ssh root@62.72.31.25 'cd /var/www/mudita_server/ && git pull origin main && npm install && pm2 restart your-app'
