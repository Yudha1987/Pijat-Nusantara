# Pijat Nusantara — MVP Website Jasa Pijat Tradisional

MVP website jasa pijat tradisional dengan desain modern, palet warna yang dapat diganti dari panel admin, responsif, dan ramah seluler. Seluruh data dikelola dari panel admin tanpa backend (menyimpan ke `localStorage`).

## Stack

- [React](https://react.dev/) 19
- [Vite](https://vite.dev/) 8
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [React Router](https://reactrouter.com/) 7 (data router + View Transitions API)

## Fitur Publik

- **Beranda** — hero, statistik, keunggulan, slider foto kegiatan, terapis & layanan populer, berita terbaru, galeri, CTA.
- **Navigasi responsif** — navbar sticky + menu hamburger, status tab aktif, tombol login admin, dan **transisi SPA** (fade-out + fade-in/slide-up via View Transitions API, scroll smooth ke atas, tanpa reload).
- **Daftar Pemijat** (`/pemijat`) — pencarian, filter gender, urutkan.
- **Profil Pemijat** (`/pemijat/:id`) — foto, keahlian, bio, rating, tombol WhatsApp/telepon, terapis terkait.
- **Katalog Layanan** (`/layanan`) — grid layanan dinamis dengan harga, durasi, filter kategori.
- **Berita** (`/berita`, `/berita/:id`) — filter kategori dan halaman detail.
- **Kontak** (`/kontak`) — alamat, jam buka, tautan peta, form dengan validasi sisi-klien.

## Panel Admin

Akses: **`/admin/login`** (tautan "Panel Admin" di footer). Rute admin terlindungi dan dialihkan ke login bila belum masuk.

| Halaman | Path | Fungsi |
| --- | --- | --- |
| Dashboard Admin | `/admin` | Ringkasan jumlah terapis, layanan, berita & slider |
| Kelola Terapis | `/admin/terapis` | CRUD terapis, unggah/ganti foto, bio, harga, rating |
| Kelola Layanan | `/admin/layanan` | CRUD layanan (nama, ikon, kategori, harga, durasi) |
| Kelola Berita | `/admin/berita` | CRUD berita (judul, kategori, gambar, isi) |
| Kelola Slider | `/admin/slider` | Unggah/atur urutan foto kegiatan di beranda |
| Tampilan Website | `/admin/penampilan` | Warna tema (preset/kustom, **tersimpan otomatis**), nama brand, teks hero, **unggah logo**, info kontak |

### Kredensial demo

```
Email: admin@pijatnusantara.id
Sandi: admin123
```

### Bagaimana data disimpan (MVP tanpa backend)

- Autentikasi & seluruh data konten disimpan di **`localStorage`** peramban (`src/context/AuthContext.jsx` & `src/context/DataContext.jsx`).
- Tema warna diterapkan lewat **CSS variables Tailwind v4** — panel admin mengubah `--color-navy-*` dan `--color-accent` di `document.documentElement`, sehingga seluruh situs ikut berganti dan bertahan setelah refresh.
- Gambar diunggah diperkecil via canvas → data URL (terapis 640px, berita 840px, slider 1024px, logo 320px PNG). Logo disimpan sebagai PNG agar bentuk & transparansi asli tidak terpotong.
- Panel admin menampilkan peringatan bila penyimpanan localStorage hampir penuh.
- Untuk produksi: hubungkan `DataContext` ke API/database (JWT auth + upload file ke storage).

## Menjalankan

```bash
npm install
npm run dev       # dev server (default http://localhost:5173)
npm run build     # build produksi ke dist/
npm run lint      # oxlint
npm run preview   # pratinjau hasil build
```

### Auto-start di Windows

`start-website.cmd` menyalakan server lalu membuka browser; `PijatNusantara-Startup.vbs` (di folder Startup Windows) memanggilnya secara tersembunyi saat PC login. Nonaktifkan auto-start dengan menghapus file `.vbs` tersebut dari folder Startup.

## Struktur Folder

```
pijat-traditional/
├── index.html
├── vite.config.js
├── start-website.cmd            # auto-start server + buka browser
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── images/
│       ├── therapists/          # placeholder foto terapis (SVG)
│       ├── news/                # ilustrasi berita (SVG)
│       └── slider/              # placeholder slider kegiatan (SVG)
└── src/
    ├── main.jsx                 # entry + AuthProvider + DataProvider
    ├── App.jsx                  # router (createBrowserRouter) + rute publik & admin
    ├── index.css                # Tailwind + tema navy/accent + animasi transisi
    ├── context/
    │   ├── AuthContext.jsx      # login/logout admin (localStorage)
    │   └── DataContext.jsx      # CRUD terapis, layanan, berita, slider, pengaturan situs
    ├── data/
    │   ├── therapists.js        # data pemijat awal
    │   ├── services.js          # data layanan & kategori
    │   └── news.js              # data berita awal
    ├── utils/
    │   ├── contact.js           # helper link WA/tel & format harga
    │   ├── format.js            # format tanggal
    │   ├── image.js             # resize, kompresi, fallback avatar
    │   └── color.js             # preset tema, generate skala warna, applyPalette
    ├── components/
    │   ├── layout/              # Layout, Navbar, Footer, PageTransition, ScrollToTop
    │   ├── ui/                  # SectionTitle, StatCard, Rating, PageHero
    │   ├── therapists/          # TherapistCard
    │   ├── news/                # NewsCard
    │   └── slider/              # PhotoSlider
    └── pages/
        ├── Dashboard.jsx        # /
        ├── Therapists.jsx       # /pemijat
        ├── TherapistProfile.jsx # /pemijat/:id
        ├── Services.jsx         # /layanan
        ├── NewsList.jsx         # /berita
        ├── NewsDetail.jsx       # /berita/:id
        ├── Contact.jsx          # /kontak
        └── admin/
            ├── AdminLogin.jsx       # /admin/login
            ├── AdminLayout.jsx      # sidebar admin + proteksi rute
            ├── AdminDashboard.jsx   # /admin
            ├── AdminTherapists.jsx  # /admin/terapis
            ├── AdminServices.jsx    # /admin/layanan
            ├── AdminNews.jsx        # /admin/berita
            ├── AdminSlider.jsx      # /admin/slider
            └── AdminAppearance.jsx  # /admin/penampilan
```

## Palet Warna

Tema didefinisikan di `src/index.css` melalui blok `@theme` Tailwind (skala `navy-50`–`navy-950`) dengan warna utama biru gelap `#0d1640` dan aksen. Admin dapat mengganti seluruh palet (7 preset atau base color kustom) langsung dari panel **Tampilan Website**, dan pilihan itu langsung tersimpan permanen.
