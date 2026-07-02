import { create } from "./models/digitalAsset.model.js";

async function seed() {
  try {
    const asset = {
      title: "Katalog UMKM Desa Pintar",
      desc: "Platform buat warga jualan online, lengkap sama katalog produk dan link WhatsApp pengrajin. Sangat mudah digunakan oleh pemula.",
      category: "Web & Sistem",
      type: "web",
      tech_stack: JSON.stringify(["React", "Tailwind CSS", "Supabase"]),
      features: JSON.stringify([
        "Katalog produk dengan foto & harga",
        "Filter kategori UMKM",
        "Tombol langsung WhatsApp pengrajin",
        "Dashboard admin untuk CRUD produk"
      ]),
      steps: JSON.stringify([
        { num: 1, title: 'Ambil Berkas Aplikasi', desc: 'Ajukan izin guna, dan kami akan memberikan akses ke berkas aplikasi.' },
        { num: 2, title: 'Konfigurasi Database', desc: 'Atur koneksi database di file environment dan jalankan migrasi.' },
        { num: 3, title: 'Upload ke Hosting', desc: 'Deploy ke Vercel atau Railway, pastikan environment variables terisi.' }
      ]),
      repo_url: "https://github.com/HIMA-TI/katalog-umkm-desa",
      guide_url: "https://example.com/guide",
      image_url: null,
      image_public_id: null,
      icon: "ShoppingCart",
      demo_url: "https://example.com/demo",
      stats: JSON.stringify({ users: 15, generated: 120 }),
      difficulty: "Menengah",
      system_req: "Internet Stabil, Browser PC untuk Admin",
      is_hot: true,
      is_recommended: true,
      developer: JSON.stringify({ name: 'Budi Wibowo', role: 'Fullstack Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi' }),
      testimonial: JSON.stringify({ quote: 'Penjualan kerajinan bambu warga naik pesat setelah ada katalog ini.', author: 'Ketua BUMDes' }),
      changelog: JSON.stringify([{ version: 'v2.0', desc: 'Migrasi ke Supabase untuk database' }, { version: 'v1.5', desc: 'Fitur tombol WhatsApp' }]),
      faqs: JSON.stringify([
        { q: 'Bagaimana admin menambah produk?', a: 'Admin bisa login ke dashboard /admin menggunakan akun default lalu klik Tambah Produk.' }
      ])
    };

    const result = await create(asset);
    console.log("Successfully seeded digital asset:", result);
  } catch (error) {
    console.error("Failed to seed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
