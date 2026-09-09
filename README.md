# 🎓 Aplikasi Simulasi Ujian BPS

Aplikasi ini adalah simulasi ujian berbasis Web yang dibuat khusus untuk latihan Ujian Penyesuaian Kenaikan Pangkat (UPKP) dan Uji Kompetensi (UKOM) di lingkungan Badan Pusat Statistik (BPS).

Aplikasi ini dirancang dengan antarmuka yang modern, interaktif, dan ringan tanpa memerlukan instalasi aplikasi tambahan maupun koneksi internet (bisa berjalan secara *offline*).

---

## 🚀 Cara Menjalankan Aplikasi

Anda **TIDAK PERLU** menginstal aplikasi apapun seperti web server, PHP, atau database. Aplikasi ini 100% menggunakan HTML, CSS, dan JavaScript murni.

Ikuti langkah-langkah mudah berikut:
1. Buka aplikasi **File Explorer** di Windows Anda.
2. Masuk ke folder aplikasi ini:
   `d:\2. Badan Pusat Statistik\1. Badan Pusat Statistik Kab. Toraja Utara\11. UJIAN PI DAN UKOM\Aplikasi Simulasi Ujian`
3. Cari file bernama **`index.html`**.
4. **Klik ganda (double-click)** pada file `index.html` tersebut.
5. Selesai! Aplikasi akan otomatis terbuka di web browser default Anda (seperti Google Chrome, Microsoft Edge, atau Mozilla Firefox).

---

## 📝 Cara Menambahkan & Mengedit Soal

Data soal-soal (bank soal) disimpan secara terpisah di dalam file **`data.js`**. Jika Anda ingin menambahkan soal asli dari file PDF/Gambar, Anda bisa mengedit file ini.

### Langkah-langkah:
1. Klik kanan pada file **`data.js`**, lalu pilih **"Open with"** -> **"Notepad"** (atau gunakan aplikasi teks editor lain seperti VS Code jika punya).
2. Di dalam file tersebut, Anda akan melihat struktur kode seperti ini:

```javascript
{
    id: 1, // Nomor urut soal (tidak wajib berurutan)
    text: "Teks pertanyaan Anda di sini...",
    options: [
        "Pilihan A",
        "Pilihan B",
        "Pilihan C",
        "Pilihan D",
        "Pilihan E"
    ],
    correctAnswer: 0, // Kunci Jawaban. (0 = Pilihan A, 1 = B, 2 = C, 3 = D, 4 = E)
    explanation: "Penjelasan mengapa jawaban tersebut benar (Boleh dikosongkan)"
}
```

3. Silakan ketik soal (atau *copy-paste* dari file lain) dan ganti teks di dalam tanda kutip `" "`.
4. Untuk **Kunci Jawaban (`correctAnswer`)**, ingat bahwa perhitungannya dimulai dari **angka 0**:
   - `0` untuk Pilihan ke-1 (A)
   - `1` untuk Pilihan ke-2 (B)
   - `2` untuk Pilihan ke-3 (C)
   - `3` untuk Pilihan ke-4 (D)
   - `4` untuk Pilihan ke-5 (E)
5. Jika sudah selesai mengubah atau menambah soal, **Simpan / Save (Ctrl + S)** file `data.js` tersebut.
6. Muat ulang (*Refresh/F5*) browser yang sedang membuka `index.html`, maka soal terbaru otomatis muncul.

---

## 🛠️ Pengaturan Waktu Ujian
Jika Anda ingin mengubah durasi waktu simulasi (saat ini default-nya 15 menit), Anda bisa melakukannya di dalam file **`data.js`**. 
Cari teks `durationMinutes: 15` dan ubah angkanya sesuai dengan menit yang Anda inginkan.

---

Selamat berlatih, semoga sukses dalam ujian UPKP dan UKOM PJL!
