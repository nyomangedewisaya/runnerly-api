<div align="center">

# Runnerly API 🏃💨
**A REST API for the Runnerly fitness & running tracker application**
<p>Referensi dan implementasi soal Lomba Kompetensi Siswa (LKS) Nasional 2025</p>

</div>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

## 📋 Tentang Project
Runnerly API adalah backend REST API yang tangguh, dirancang untuk melayani aplikasi mobile pelacakan kebugaran dan lari. Proyek ini menyediakan semua fungsionalitas inti yang dibutuhkan, mulai dari autentikasi pengguna, pencatatan aktivitas, hingga sistem tantangan yang interaktif dengan papan peringkat.

Dibangun dengan teknologi modern seperti Express.js dan Prisma ORM, API ini dirancang agar efisien, aman, dan mudah untuk dikembangkan lebih lanjut.

## ✨ Fitur Unggulan
<table width="100%">
<tbody>
<tr>
<td width="50%" valign="top">
<h3>🔐 Autentikasi & Pengguna</h3>
<ul>
<li>🙋 Registrasi pengguna dengan validasi umur.</li>
<li>🔑 Login aman menggunakan email & password.</li>
<li>🛡️ Otorisasi berbasis JWT (JSON Web Token).</li>
<li>👤 Profil pengguna dengan data personal.</li>
</ul>
</td>
<td width="50%" valign="top">
<h3>👟 Pelacakan Aktivitas</h3>
<ul>
<li>📝 CRUD lengkap untuk aktivitas (lari, sepeda, dll).</li>
<li>📊 Statistik personal (total jarak, kalori, dll).</li>
<li>🏅 Perhitungan rekor pribadi (<em>Personal Bests</em>).</li>
<li>📜 Riwayat aktivitas dengan pagination.</li>
</ul>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>🏆 Tantangan & Kompetisi</h3>
<ul>
<li>🥇 Melihat daftar tantangan yang sedang aktif.</li>
<li>📈 Papan peringkat (<em>Leaderboard</em>) dinamis untuk setiap tantangan.</li>
<li>🤝 Sistem partisipasi pengguna dalam tantangan.</li>
<li>📅 Tantangan dengan periode waktu (mulai & selesai).</li>
</ul>
</td>
<td width="50%" valign="top">
<h3>⚙️ Backend & Database</h3>
<ul>
<li>🔩 Dibangun dengan Express.js untuk performa tinggi.</li>
<li>🗃️ Interaksi database aman & modern via Prisma ORM.</li>
<li>🌱 Sistem Seeder untuk data demo yang kaya.</li>
<li>📦 Struktur proyek modular yang rapi (Routes, Utils).</li>
</ul>
</td>
</tr>
</tbody>
</table>

## 📝 Dokumentasi Endpoint API
<h3 align="center">Authentication (<code>/api/auth</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/register</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendaftarkan pengguna baru.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>username</code>, <code>email</code>, <code>password</code>, <code>fullName</code>, <code>age</code></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/login</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Login dan mendapatkan token autentikasi (JWT).</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>email</code>, <code>password</code></td>
    </tr>
  </tbody>
</table>

<h3 align="center">Activities (<code>/api/activities</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendapatkan daftar semua aktivitas.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Query</i>: <code>userId</code> (opsional), <code>page</code>, <code>pageSize</code></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>POST</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Membuat catatan aktivitas baru.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>userId</code>, <code>date</code>, <code>distance</code>, <code>duration: { time }</code></td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/stats</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendapatkan statistik aktivitas pengguna.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Query</i>: <code>userId</code> (wajib)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:id</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendapatkan detail satu aktivitas.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code> aktivitas</td>
    </tr>
  </tbody>
</table>

<h3 align="center">Challenges (<code>/api/challenges</code>)</h3>
<table width="100%" style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Method</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Endpoint</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Deskripsi</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Body / Params</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/active</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendapatkan daftar tantangan aktif.</td>
      <td style="padding: 8px; border: 1px solid #ddd;">-</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>GET</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;"><code>/:id/leaderboard</code></td>
      <td style="padding: 8px; border: 1px solid #ddd;">Mendapatkan papan peringkat tantangan.</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><i>Param</i>: <code>id</code> tantangan</td>
    </tr>
  </tbody>
</table>

## 🚀 Panduan Memulai
<details>
<summary><strong>Klik untuk melihat langkah-langkah instalasi & konfigurasi</strong></summary>




### 📦 Prasyarat
Pastikan environment Anda telah terinstal:

<ul>
  <li>Node.js (v18 atau lebih baru)</li>  
  <li>NPM (terinstal bersama Node.js)</li>  
  <li>Server MySQL</li>  
</ul>

### 1. Clone Repository
```bash
git clone https://github.com/nyomangedewisaya/runnerly-api.git
cd runnerly-api
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file baru bernama .env di root proyek, lalu isi dengan konfigurasi database Anda.

### 4. Ganti USER, PASSWORD, HOST, PORT, dan DATABASE dengan milik Anda, serta tambahkan secret key untuk JWT dalam file .env
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="KATA_RAHASIA_YANG_SANGAT_AMAN"
```

### 5. Reset & Isi Database
Perintah ini akan menghapus database (jika ada), membuat ulang skema, dan mengisinya dengan data demo dari seeder.
```bash
npx prisma migrate reset
```
**⚠️ Peringatan: Semua data lama akan hilang.**


### 6. Jalankan Server
```bash
npm start
```

**🎉 API Anda sekarang berjalan di http://localhost:3000**

</details>

<div align="center">

<hr>
<h3>💡 Runnerly API – Fondasi Backend yang Kuat untuk Aplikasi Kebugaran Anda</h3>

<p>Jika proyek ini bermanfaat, jangan lupa beri bintang ⭐ di repository untuk mendukung pengembangan lebih lanjut!</p>

</div>
