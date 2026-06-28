# Personal Portfolio CMS (Go + React + PostgreSQL)

Aplikasi Web Portofolio Pribadi terintegrasi Content Management System (CMS) yang dirancang menggunakan pendekatan **Clean Architecture** pada backend dan struktur **Modular Component** pada frontend. Proyek ini dibangun untuk memenuhi kriteria tugas kuliah, mendukung tampilan responsif (mobile & desktop), dan siap dihosting secara gratis minimal selama 3 bulan.

---

## 1. Deskripsi Proyek & Fitur Utama

Aplikasi ini dibagi menjadi dua bagian: halaman publik yang diakses oleh pengunjung umum (*Visitor*) dan halaman panel kontrol terproteksi yang diakses oleh pemilik situs (*Admin*).

### Fitur Pengunjung (Visitor Role):
*   **Landing Page**: Sambutan profesional (*hero banner*), ringkasan profil, dan keahlian utama.
*   **About Page**: Deskripsi riwayat lengkap pemilik portofolio beserta tautan unduh berkas CV.
*   **Technical Skills**: Visualisasi tingkat kemahiran teknologi (*stack*) menggunakan bar progres dinamis.
*   **Projects Gallery**: Galeri seluruh karya proyek perangkat lunak lengkap dengan kategori filter pencarian, tautan repositori GitHub, serta demo link.
*   **Certificates Timeline**: Daftar piagam sertifikasi kompetensi profesional yang disusun berdasarkan tanggal terbit terbaru.
*   **Contact Form**: Formulir bagi pengunjung untuk mengirimkan pesan/saran langsung ke database pemilik.

### Fitur Pemilik (Admin Role - CMS):
*   **Otentikasi Secure JWT**: Login/Logout terproteksi token JWT yang disimpan dalam bentuk *HTTPOnly Secure Cookie*.
*   **Default Seeder**: Pembuatan otomatis akun admin awal (`admin@example.com` / `admin123`) saat database dijalankan pertama kali.
*   **Dashboard Stats**: Ikhtisar total data proyek, skill, sertifikat, dan jumlah pesan masuk yang belum dibaca secara real-time.
*   **Profile Settings**: Mengedit detail nama, headline, bio, dan unggah foto profil (*avatar*).
*   **Skills CRUD**: Menambah, mengedit, dan menghapus daftar keahlian teknis beserta persentase kemahiran.
*   **Projects CRUD**: Mengelola portofolio proyek lengkap dengan fitur **upload gambar thumbnail** proyek.
*   **Certificates CRUD**: Mengelola arsip sertifikat lengkap dengan fitur **upload gambar berkas** sertifikat.
*   **Inbox Message Manager**: Membaca pesan masuk dari visitor, menandai status terbaca, atau menghapus pesan.

---

## 2. Stack Teknologi

### Backend (Golang):
*   **Bahasa Pemrograman**: Go (Golang) v1.25.1
*   **Web Framework**: Fiber v2 (Cepat, berbasis engine ExpressJS)
*   **ORM**: GORM (Object Relational Mapping) untuk PostgreSQL
*   **Otentikasi**: JWT (JSON Web Token) & password hashing menggunakan Bcrypt
*   **Konfigurasi**: GoDotEnv (pemuat `.env` lokal)

### Frontend (React):
*   **Library Utama**: React v18
*   **Build Tool**: Vite (Sangat ringan dan cepat saat development)
*   **Styling**: Tailwind CSS (Utilitas class CSS)
*   **Navigasi**: React Router DOM v6
*   **HTTP Client**: Axios (Komunikasi ke backend)
*   **Ikon Visual**: Lucide React Icons

---

## 3. Desain Database (PostgreSQL)

Hubungan relasional antar tabel didesain secara terpusat mengarah pada tabel pengguna (`users`):

```
[users] (1) <---> (1) [profile]
[users] (1) <---> (N) [skills]
[users] (1) <---> (N) [projects]
[users] (1) <---> (N) [certificates]
[users] (1) <---> (N) [contacts]
```

### Kamus Data Tabel:
1.  **`users`**: ID (UUID), Email (Unique), PasswordHash, Role, Timestamps.
2.  **`profiles`**: ID (UUID), UserID (FK), FullName, Title, Bio, AvatarURL, ResumeURL, SocialLinks (JSONB: Email, WhatsApp, LinkedIn, GitHub), Timestamp.
3.  **`skills`**: ID (UUID), UserID (FK), Name, Percentage (0-100), Timestamp.
4.  **`projects`**: ID (UUID), UserID (FK), Title, Description, ImageURL, GithubURL, DemoURL, Category, Timestamps.
5.  **`certificates`**: ID (UUID), UserID (FK), Name, Organization, IssueDate (Date), ImageURL, Timestamps.
6.  **`contacts`**: ID (UUID), UserID (FK), SenderName, SenderEmail, Subject, Message, IsRead (Boolean), Timestamp.

---

## 4. Dokumentasi API (API Endpoints)

Seluruh endpoint API diawali dengan prefiks `/api`.

### Rute Publik (Akses Bebas):
*   `GET /api/profile` - Mengambil profil lengkap & kontak admin.
*   `GET /api/skills` - Mengambil semua data skill kemahiran.
*   `GET /api/projects` - Mengambil semua galeri proyek.
*   `GET /api/projects/:id` - Mengambil rincian detail satu proyek.
*   `GET /api/certificates` - Mengambil semua sertifikasi.
*   `POST /api/contacts` - Mengirim pesan baru dari visitor.

### Rute Otentikasi:
*   `POST /api/auth/login` - Verifikasi admin dan inisiasi sesi cookie.
*   `POST /api/auth/logout` - Menghapus sesi cookie login admin.

### Rute Admin (Wajib Token Auth JWT):
*   `GET /api/admin/check` - Verifikasi token aktif.
*   `GET /api/admin/profile` & `PUT /api/admin/profile` - Kelola biodata profil.
*   `POST /api/admin/profile/avatar` - Unggah foto profil admin.
*   `POST`, `GET`, `PUT`, `DELETE` pada `/api/admin/skills` - Kelola CRUD skill.
*   `POST`, `GET`, `PUT`, `DELETE` pada `/api/admin/projects` - Kelola CRUD proyek.
*   `POST /api/admin/projects/:id/image` - Unggah gambar proyek.
*   `POST`, `GET`, `PUT`, `DELETE` pada `/api/admin/certificates` - Kelola CRUD sertifikat.
*   `POST /api/admin/certificates/:id/image` - Unggah berkas sertifikat.
*   `GET /api/admin/contacts` - Membaca semua inbox pesan masuk.
*   `PATCH /api/admin/contacts/:id/read` - Menandai status pesan terbaca.
*   `DELETE /api/admin/contacts/:id` - Menghapus pesan masuk.

---

## 5. Panduan Deployment

Aplikasi dirancang agar dapat dihosting secara gratis selamanya menggunakan kombinasi 3 platform cloud:

### 5.1. Database (Neon.tech / Supabase)
1.  Daftar di [Neon.tech](https://neon.tech) atau [Supabase](https://supabase.com).
2.  Buat database PostgreSQL dan salin DSN / Connection String.
3.  Pastikan parameter SSL aktif (`sslmode=require`).

### 5.2. Backend (Render.com)
1.  Buat **Web Service** baru di Render dan hubungkan ke GitHub repositori Anda.
2.  Setel opsi build berikut:
    *   *Root Directory*: `backend`
    *   *Build Command*: `go build -o api cmd/api/main.go`
    *   *Start Command*: `./api`
3.  Di menu **Environment Variables**, isi parameter port server `PORT=10000`, isikan kredensial database cloud, dan buat `JWT_SECRET` yang aman.

### 5.3. Frontend (Vercel)
1.  Edit berkas `frontend/vercel.json` pada repositori lokal Anda. Ganti baris `destination` URL ke alamat web service Render Anda yang aktif (misal: `https://app-backend.onrender.com`).
2.  Buat proyek baru di Vercel dan hubungkan ke repositori GitHub yang sama.
3.  Setel opsi build berikut:
    *   *Root Directory*: `frontend`
    *   *Framework Preset*: `Vite`
    *   *Build Command*: `npm run build`
    *   *Output Directory*: `dist`
4.  Klik **Deploy** dan website portofolio Anda siap diakses secara online!
