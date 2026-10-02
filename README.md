# Aplikasi Simulasi Ujian BPS

Aplikasi ini merupakan simulasi ujian berbasis Web yang ditujukan untuk latihan Ujian Penyesuaian Kenaikan Pangkat (UPKP) dan Uji Kompetensi (UKOM) di lingkungan Badan Pusat Statistik. Aplikasi dirancang agar dapat diakses secara luring (offline) tanpa memerlukan instalasi aplikasi tambahan.

## Panduan Penggunaan

Aplikasi ini dibangun menggunakan HTML, CSS, dan JavaScript tanpa memerlukan peladen web (web server) maupun pangkalan data (database).

Langkah-langkah untuk menjalankan aplikasi:
1. Buka File Explorer pada sistem operasi Anda.
2. Akses direktori repositori aplikasi ini.
3. Buka (klik ganda) berkas bernama `index.html`.
4. Aplikasi akan otomatis terbuka melalui peramban web (web browser) bawaan Anda.

## Pembaruan Data Soal

Data bank soal disimpan dalam berkas `data.js`. Anda dapat memodifikasi berkas ini untuk menambah atau memperbarui daftar pertanyaan.

Langkah-langkah penyuntingan:
1. Buka berkas `data.js` menggunakan aplikasi penyunting teks (seperti Notepad atau Visual Studio Code).
2. Temukan struktur kode soal sebagai berikut:

```javascript
{
    id: 1, 
    text: "Teks pertanyaan",
    options: [
        "Pilihan A",
        "Pilihan B",
        "Pilihan C",
        "Pilihan D",
        "Pilihan E"
    ],
    correctAnswer: 0, // Kunci Jawaban (0 = A, 1 = B, 2 = C, 3 = D, 4 = E)
    explanation: "Penjelasan jawaban"
}
```

3. Modifikasi bagian di dalam tanda kutip sesuai kebutuhan. Indeks kunci jawaban (`correctAnswer`) dimulai dari angka 0.
4. Simpan perubahan pada berkas `data.js`.
5. Muat ulang halaman peramban web untuk melihat pembaruan soal.

## Pengaturan Waktu Ujian

Durasi ujian dapat disesuaikan melalui berkas `data.js`. Ubah nilai pada variabel `durationMinutes` sesuai dengan durasi waktu (dalam menit) yang dibutuhkan.
