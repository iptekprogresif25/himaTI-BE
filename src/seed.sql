INSERT INTO digital_assets (
  title, "desc", category, type, tech_stack, features, steps, repo_url, guide_url, icon, demo_url, stats, difficulty, system_req, is_hot, is_recommended, developer, testimonial, changelog, faqs
) VALUES (
  'Katalog UMKM Desa Pintar',
  'Platform buat warga jualan online, lengkap sama katalog produk dan link WhatsApp pengrajin. Sangat mudah digunakan oleh pemula.',
  'Web & Sistem',
  'web',
  '["React", "Tailwind CSS", "Supabase"]',
  '["Katalog produk dengan foto & harga", "Filter kategori UMKM", "Tombol langsung WhatsApp pengrajin", "Dashboard admin untuk CRUD produk"]',
  '[{"num": 1, "title": "Ambil Berkas Aplikasi", "desc": "Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi."}, {"num": 2, "title": "Konfigurasi Database", "desc": "Atur koneksi database di file environment dan jalankan migrasi."}, {"num": 3, "title": "Upload ke Hosting", "desc": "Deploy ke Vercel atau Railway, pastikan environment variables terisi."}]',
  'https://github.com/HIMA-TI/katalog-umkm-desa',
  'https://example.com/guide',
  'ShoppingCart',
  'https://example.com/demo',
  '{"users": 15, "generated": 120}',
  'Menengah',
  'Internet Stabil, Browser PC untuk Admin',
  true,
  true,
  '{"name": "Budi Wibowo", "role": "Fullstack Dev", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"}',
  '{"quote": "Penjualan kerajinan bambu warga naik pesat setelah ada katalog ini.", "author": "Ketua BUMDes"}',
  '[{"version": "v2.0", "desc": "Migrasi ke Supabase untuk database"}, {"version": "v1.5", "desc": "Fitur tombol WhatsApp"}]',
  '[{"q": "Bagaimana admin menambah produk?", "a": "Admin bisa login ke dashboard /admin menggunakan akun default lalu klik Tambah Produk."}]'
);
