---
title: "Server Debian 13: Instalasi, Pengamanan Esensial, dan Konfigurasi Repositori"
pubDate: "2026-07-23"
description: "Panduan lengkap langkah-demi-langkah menginstal Server Debian 13 (Trixie), mengonfigurasi format repositori DEB822 baru, dan menerapkan pengamanan awal pasca-instalasi."
tags: ["linux", "debian", "sysadmin", "security"]
draft: false
---

Debian 13 (dengan nama kode **Trixie**) membawa paket-paket terbaru, peningkatan keamanan default, dan pendekatan modern untuk administrasi sistem. Sebagai SysAdmin, pilihan utama saya untuk lingkungan produksi adalah Debian karena stabilitasnya yang luar biasa dan siklus rilis yang dapat diprediksi.

Dalam catatan log ini, kita akan mempelajari proses menyiapkan Server Debian 13 baru, bertransisi ke format repositori DEB822 yang modern, dan menerapkan pengamanan awal sistem.

---

## 1. Mempersiapkan Instalasi

### Persyaratan Sistem
Untuk Server Debian 13 tanpa antarmuka grafis (headless), persyaratannya sangat ringan:
* **CPU:** 1 GHz (direkomendasikan 2 GHz atau lebih tinggi)
* **RAM:** 512 MB (direkomendasikan 2 GB agar nyaman)
* **Penyimpanan:** 10 GB (disarankan SSD)

### Panduan Langkah-demi-Langkah Installer

Unduh file ISO Netinst dari cermin resmi Debian, boot server/VM Anda dari file tersebut, dan ikuti langkah-langkah berikut:

#### 1. Menu Boot
Pilih **Graphical Install** (direkomendasikan agar mudah) atau **Install** (mode teks).

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

#### 2. Pemilihan Bahasa dan Keyboard
Pilih bahasa utama (misalnya English), lokasi Anda (misalnya Indonesia), dan tata letak keyboard (misalnya American English).

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

#### 3. Konfigurasi Jaringan
Masukkan nama host sistem Anda (misalnya `debian-srv`) dan nama domain lokal jika ada.

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

#### 4. Pengguna dan Kata Sandi
Buat kata sandi yang kuat untuk akun `root`. Selanjutnya, buat akun pengguna administrator biasa (misalnya `agungb`) beserta kata sandinya.

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

#### 5. Pemisahan Penyimpanan (Partitioning)
Untuk server standar, memilih **Guided - use entire disk** adalah pilihan yang mudah dan efektif.

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

#### 6. Pemilihan Perangkat Lunak (Software Selection)
Ini adalah langkah paling penting. Agar server tetap ringan dan aman, pastikan untuk menghapus centang pada antarmuka desktop:

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
> Menonaktifkan antarmuka desktop menjaga beban memori server tetap minimal, menghemat RAM, dan mengurangi celah potensi serangan keamanan.

---

## 2. Mengonfigurasi Repositori Debian 13 (Format Baru DEB822)

Secara tradisional, konfigurasi APT disimpan di `/etc/apt/sources.list` menggunakan sintaks satu baris. Mulai versi Debian modern, Debian sepenuhnya beralih ke format **DEB822** yang berlokasi di bawah `/etc/apt/sources.list.d/debian.sources`.

Format DEB822 ini lebih bersih, terstruktur seperti blok konfigurasi, dan memungkinkan Anda menentukan kunci keamanan serta arsitektur per repositori dengan mudah.

### Langkah 1: Buka Konfigurasi Repositori Baru
Masuk ke server Anda dan buka berkas konfigurasi repositori:

```bash
sudo nano /etc/apt/sources.list.d/debian.sources
```

### Langkah 2: Edit atau Definisikan Repositori
Berikut adalah tata letak repositori siap produksi untuk **Debian 13 (Trixie)**:

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

* **non-free-firmware**: Sangat penting untuk server modern yang memiliki driver perangkat keras berpemilik (seperti microcode Intel/AMD atau kartu jaringan).
* **trixie-security**: Memastikan Anda langsung menerima pembaruan keamanan krusial.

Simpan berkas (`Ctrl+O`, `Enter`) dan keluar (`Ctrl+X`).

### Langkah 3: Jalankan Pembaruan
Perbarui daftar paket sistem Anda untuk menerapkan repositori baru:

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 3. Langkah Pengamanan Esensial Pasca-Instalasi

Setelah repositori selesai dikonfigurasi, lakukan langkah-langkah berikut untuk mengamankan server baru Anda.

### Langkah 1: Konfigurasi Akses Sudo
Jika Anda belum mengonfigurasi `sudo` selama instalasi, masuklah sebagai root dan instal aplikasinya:

```bash
apt install sudo -y
```

Masukkan user biasa Anda ke dalam grup `sudo`:

```bash
usermod -aG sudo agungb
```

Keluar dari root dan masuk kembali menggunakan user biasa Anda agar perubahan grup diterapkan.

### Langkah 2: Siapkan Otentikasi Kunci SSH
Gunakan kunci SSH dari komputer lokal Anda untuk disalin ke server untuk menghindari penggunaan kata sandi biasa yang kurang aman:

```bash
# Di jalankan di komputer LOKAL Anda
ssh-copy-id -p 22 agungb@ip_server_anda
```

Setelah tersalin, pastikan Anda bisa masuk tanpa diminta mengetik kata sandi.

### Langkah 3: Amankan SSH Daemon
Buka konfigurasi pengamanan SSH:

```bash
sudo nano /etc/ssh/sshd_config.d/hardening.conf
```

Tambahkan aturan pengamanan berikut:

```ini
# Ubah port default untuk menghindari pemindaian bot otomatis
Port 2222

# Larang masuk sebagai root melalui SSH
PermitRootLogin no

# Hanya izinkan masuk menggunakan Kunci SSH
PasswordAuthentication no
PubkeyAuthentication yes

# Putuskan koneksi yang tidak aktif
ClientAliveInterval 300
ClientAliveCountMax 2
```

Mulai ulang layanan SSH:

```bash
sudo systemctl restart ssh
```

> [!CAUTION]
> Jangan tutup sesi terminal Anda saat ini sampai Anda berhasil menguji login baru menggunakan Port 2222 di jendela terminal terpisah!

---

## 4. Menyiapkan Firewall (UFW)

Batasi lalu lintas jaringan masuk dengan memblokir semua port kecuali yang secara eksplisit diperlukan (seperti port SSH kustom `2222`):

```bash
sudo apt install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2222/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Periksa status firewall:

```bash
sudo ufw status verbose
```

---

## 5. Kesimpulan

Server Debian 13 Anda sekarang berjalan dengan:
1. Sistem dasar yang bersih dan sangat minimal.
2. Format repositori **DEB822** yang modern untuk pembaruan paket yang efisien.
3. Akses SSH yang aman dan dilindungi oleh firewall aktif.

Server Anda sekarang siap digunakan untuk menginstal Docker, menyiapkan proxy terbalik Nginx, atau mulai menerapkan layanan backend Anda.
