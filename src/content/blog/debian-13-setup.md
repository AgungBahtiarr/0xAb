---
title: "Debian 13 Server: Installation, Essential Hardening, and Repository Configuration"
pubDate: "2026-07-23"
description: "A complete step-by-step guide to installing Debian 13 (Trixie) Server, configuring the new DEB822 repository format, and applying essential post-install hardening."
tags: ["linux", "debian", "sysadmin", "security"]
draft: false
---

Debian 13 (Codenamed **Trixie**) brings updated packages, enhanced security defaults, and a modern approach to system administration. As a SysAdmin, my go-to choice for production environments is Debian due to its rock-solid stability and predictable release cycle. 

In this log, we will walk through the process of setting up a fresh Debian 13 Server, transitioning to the modern DEB822 repository format, and applying initial security hardening.

---

## 1. Preparing the Installation

### System Requirements
For a clean, head-less Debian 13 Server, you don't need much:
* **CPU:** 1 GHz (2 GHz or higher recommended)
* **RAM:** 512 MB (2 GB recommended for comfortable operations)
* **Storage:** 10 GB (SSD preferred)

### Step-by-Step Installer Walkthrough

Download the Netinst ISO from the official Debian mirror, boot your server/VM from it, and follow these steps:

#### 1. Boot Menu
Select **Graphical Install** or **Install** (text mode is faster and identical in results).

```text
  ┌──────────────────────────────────────────────────────────────────┐
  │                   Debian GNU/Linux Installer                     │
  ├──────────────────────────────────────────────────────────────────┤
  │                                                                  │
  │  * Graphical install                                             │
  │    Install                                                       │
  │    Advanced options                                              │
  │    Accessible dark contrast installer menu                       │
  │                                                                  │
  │                                                                  │
  │  Press ENTER to boot                                             │
  └──────────────────────────────────────────────────────────────────┘
```

#### 2. Language and Keyboard Selection
Choose your preferred language (e.g., English), location (e.g., Indonesia), and keyboard keymap layout (e.g., American English).

```text
  ┌───────────────────────┤ Select a language ├──────────────────────┐
  │                                                                  │
  │  Choose the language to be used for the installation process.    │
  │                                                                  │
  │  Danish                                                          │
  │  Dutch                                                           │
  │  English                                                    [X]  │
  │  Esperanto                                                       │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘
```

#### 3. Network Configuration
Set your system hostname (e.g., `debian-srv`) and local domain name if any.

```text
  ┌─────────────────────┤ Configure the network ├────────────────────┐
  │                                                                  │
  │  Please enter the hostname for this system.                      │
  │                                                                  │
  │  Hostname:                                                       │
  │  [ debian-srv_________________________________________________ ] │
  │                                                                  │
  │     <Go Back>                                    <Continue>      │
  └──────────────────────────────────────────────────────────────────┘
```

#### 4. Users and Passwords
Set a robust password for the `root` account. Next, configure a non-root standard administrative user (e.g., `agungb`) along with their password.

```text
  ┌──────────────────┤ Set up users and passwords ├──────────────────┐
  │                                                                  │
  │  A password for the administrator account (root) is required.    │
  │                                                                  │
  │  Root password:                                                  │
  │  [ **********_________________________________________________ ] │
  │                                                                  │
  │     <Go Back>                                    <Continue>      │
  └──────────────────────────────────────────────────────────────────┘
```

#### 5. Partitioning Storage
For standard server instances, choosing **Guided - use entire disk** is simple and effective.

```text
  ┌───────────────────────┤ Partition disks ├────────────────────────┐
  │                                                                  │
  │  The installer can guide you through partitioning a disk.        │
  │                                                                  │
  │  * Guided - use entire disk                                      │
  │    Guided - use entire disk and set up LVM                       │
  │    Guided - use entire disk and set up encrypted LVM             │
  │    Manual                                                        │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘
```

#### 6. Software Selection
This is the most critical server configuration step. To ensure a lightweight, secure deployment, make sure to uncheck any desktop environments:

```text
  ┌──────────────────────┤ Software selection ├──────────────────────┐
  │                                                                  │
  │  Choose software to install:                                     │
  │                                                                  │
  │  [ ] Debian desktop environment                                  │
  │  [ ] ... GNOME                                                   │
  │  [*] SSH server                                                  │
  │  [*] Standard system utilities                                   │
  │                                                                  │
  │     <Go Back>                                    <Continue>      │
  └──────────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> Disabling the Desktop Environment keeps the server footprint minimal, reducing memory overhead and limiting the security attack surface.

---

## 2. Configuring Debian 13 Repositories (The New DEB822 Format)

Traditionally, APT configurations were stored in `/etc/apt/sources.list` using a single-line syntax. Starting with modern Debian versions, Debian has fully transitioned to the **DEB822** format located under `/etc/apt/sources.list.d/debian.sources`.

The DEB822 format is cleaner, structured like a configuration block, and allows you to specify secure keys and architectures per repository easily.

### Step 1: Open the new Repository Config
Log in to your server and open the sources configuration:

```bash
sudo nano /etc/apt/sources.list.d/debian.sources
```

### Step 2: Edit or Define the Repositories
Here is a production-ready repository layout for **Debian 13 (Trixie)**:

```ini
Types: deb
URIs: http://deb.debian.org/debian/
Suites: trixie trixie-updates trixie-proposed-updates
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg

Types: deb
URIs: http://security.debian.org/debian-security
Suites: trixie-security
Components: main contrib non-free non-free-firmware
Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg
```

* **non-free-firmware**: Crucial for modern servers containing proprietary hardware drivers (e.g., Intel/AMD microcode, network cards).
* **trixie-security**: Ensures you receive immediate security patches.

Save the file (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).

### Step 3: Run Updates
Update your package index to apply the new repositories:

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3. Essential Post-Install Server Setup

After your repositories are configured, perform these essential steps to secure your server.

### Step 1: Configure Sudo Access
If you didn't configure `sudo` during the installation, log in as root and install it:

```bash
apt install sudo -y
```

Add your standard user to the `sudo` group:

```bash
usermod -aG sudo agungb
```

Log out of root and log back in as your standard user to apply the group changes.

### Step 2: Set Up SSH Key Authentication
Generating an SSH key pair on your local computer is a prerequisite for disabling insecure password logins:

```bash
# On your LOCAL computer
ssh-copy-id -p 22 agungb@your_server_ip
```

Once copied, verify you can log in without typing a password.

### Step 3: Hardening SSH Daemon
Open the SSH config file:

```bash
sudo nano /etc/ssh/sshd_config.d/hardening.conf
```

Add the following security policies:

```ini
# Change default port to deter basic automated scanner bots
Port 2222

# Disable root login over SSH
PermitRootLogin no

# Only allow SSH Key logins
PasswordAuthentication no
PubkeyAuthentication yes

# Drop idle connections
ClientAliveInterval 300
ClientAliveCountMax 2
```

Restart the SSH service:

```bash
sudo systemctl restart ssh
```

> [!CAUTION]
> Do not close your current terminal session until you have successfully tested the new configuration on Port 2222 in a separate window!

---

## 4. Setting up a Firewall (UFW)

Control incoming network traffic by blocking all ports except those explicitly needed (such as custom SSH port `2222`):

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Check the firewall status:

```bash
sudo ufw status verbose
```

---

## 5. Conclusion

Your Debian 13 Server is now running with:
1. A minimal and clean base installation.
2. The modern **DEB822** repository format for streamlined package updates.
3. Locked-down SSH access and a configured stateful firewall.

From here, you are ready to install Docker, set up Nginx reverse proxies, or begin hosting your high-performance backend microservices.
