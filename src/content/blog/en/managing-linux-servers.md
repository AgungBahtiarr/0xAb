---
title: "Automating Linux Server Deployments"
pubDate: "2026-07-04"
description: "Best practices for automating secure Linux server setups, configuring UFW firewalls, SSH key access, Nginx reverse proxies, and fail2ban."
tags: ["linux", "sysadmin", "devops", "security"]
draft: false
---
As a System Administrator, I love automation. Setting up a new server manually is error-prone and time-consuming. In this post, I share my standard checklist for hardening a fresh Ubuntu server.

## 1. SSH Hardening

First, disable password authentication and change the default SSH port.

```bash
# /etc/ssh/sshd_config
Port 2222
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
```

## 2. Setting Up Firewalls (UFW)

Only allow necessary ports.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp # Custom SSH port
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## 3. Nginx Reverse Proxy

Use Nginx to reverse proxy traffic to backend services securely.

```nginx
server {
    listen 443 ssl;
    server_name api.0xab.tech;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Automation is key to maintaining a stable and secure system!
