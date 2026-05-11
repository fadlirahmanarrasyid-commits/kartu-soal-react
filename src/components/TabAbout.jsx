import React from 'react';

function TabAbout() {
  return (
    <div className="panel active print-hide">
      <div className="section-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ marginBottom: '24px' }}>
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJMsGJu8dd9KOCzehcHPXRFZTAsakHdsyhYfeXDn0da5y3tVtMH7YnDpg6upnL0IwJ_45g0sdHazzq-mhdPhojQBeRbW9V69mM5wJwZ4bcsnJH17XEO08Cu_URCRD_j8eSmLqkqNUJOFj78VWQ4KEXFPL915N97CjcOMEv4mpcz-hHpDORop618dGwvwW7/w133-h200-rw/profil.png" 
            alt="Fadli Rahman" 
            style={{ 
              width: '150px', 
              height: '200px', 
              borderRadius: '16px', 
              objectFit: 'cover', 
              border: '4px solid #0C447C',
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
            }} 
          />
        </div>
        
        <h2 style={{ fontSize: '24px', color: '#0C447C', margin: '0 0 8px 0' }}>Fadli Rahman</h2>
        <p style={{ fontSize: '16px', color: '#666', margin: '0 0 24px 0' }}>SMK Negeri 2 Sebulu</p>
        
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'left', lineHeight: '1.6', color: '#444' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', color: '#333' }}>Tentang Aplikasi</h3>
          <p>
            <strong>Aplikasi Kartu Soal AI</strong> adalah platform inovatif yang dirancang khusus untuk membantu guru di Indonesia, 
            khususnya di lingkungan SMK, dalam menyusun administrasi ujian secara efisien. Menggunakan teknologi kecerdasan buatan (AI) 
            dengan pendekatan <strong>Deep Learning</strong> (Mindful, Meaningful, & Joyful Learning), aplikasi ini mampu menghasilkan 
            kisi-kisi dan soal HOTs (Higher Order Thinking Skills) yang kontekstual dan relevan dengan dunia kerja.
          </p>
          
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', color: '#333', marginTop: '30px' }}>Kontak & Sosial Media</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
            <a href="mailto:fadhli_rahman@ymail.com" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>📧 Email</a>
            <a href="https://www.instagram.com/fadhli.arrasyid/" target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>📸 Instagram</a>
            <a href="https://web.facebook.com/clouds.strife2" target="_blank" rel="noreferrer" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>📘 Facebook</a>
          </div>

          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', color: '#333', marginTop: '30px' }}>Log Versi Aplikasi</h3>
          <div style={{ fontSize: '12px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#0C447C' }}>v1.7.0 (Latest)</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Migrasi editor dari <strong>TinyMCE</strong> ke <strong>Quill.js</strong> untuk performa yang lebih ringan dan stabil.</li>
                <li>Penambahan dukungan <strong>Subscript</strong> dan <strong>Superscript</strong> pada toolbar untuk penulisan rumus kimia.</li>
                <li>Integrasi tombol <strong>Formula</strong> (LaTeX) dengan dukungan penuh untuk rumus kimia kompleks via <code>mhchem</code>.</li>
                <li>Penyempurnaan sistem sinkronisasi repositori GitHub.</li>
              </ul>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.6.2</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Penambahan deskripsi pada <strong>Level Kognitif</strong> (C1-C6) agar lebih mudah dipahami (contoh: Mengingat, Memahami, dll).</li>
                <li>Pembaruan label level kognitif secara konsisten di seluruh bagian aplikasi (AI, Buat Soal, Kisi-kisi, dan Kartu).</li>
              </ul>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.6.1</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Penyempurnaan terminologi: <strong>Alur Tujuan Pembelajaran (ATP)</strong> kini menjadi <strong>Tujuan Pembelajaran (TP)</strong>.</li>
                <li>Input TP pada halaman Generate AI kini menggunakan <strong>Textarea</strong> (mendukung input daftar TP yang banyak sekaligus).</li>
                <li>Peningkatan Prompt AI untuk mengenali input daftar TP yang spesifik agar hasil kisi-kisi lebih akurat.</li>
                <li>Penyesuaian label pada <strong>Pratinjau Kartu Soal</strong> dan format ekspor untuk konsistensi kurikulum.</li>
              </ul>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.6.0</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Integrasi <strong>TinyMCE</strong> sebagai editor teks kaya (bold, italic, list, tabel).</li>
                <li>Dukungan <strong>Upload Gambar Lokal</strong> langsung ke dalam konten soal.</li>
                <li>Perbaikan sistem ekspor Excel: Baris baru (paragraf) kini tetap berada dalam <strong>satu sel</strong> yang sama.</li>
                <li>Penyempurnaan mode Edit: Penggunaan <strong>Radio Button</strong> untuk pemilihan kunci jawaban yang lebih intuitif.</li>
              </ul>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.5.0</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Integrasi <strong>KaTeX</strong> untuk rendering rumus Matematika profesional.</li>
                <li>Dukungan rumus Kimia dengan ekstensi <strong>mhchem</strong> (\ce).</li>
                <li>Implementasi <strong>Resilient JSON Parser</strong> (Nuclear Mode) untuk menangani data LaTeX kompleks dari AI.</li>
              </ul>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.3.2</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Implementasi export profesional ke Excel dengan dukungan ALT+ENTER.</li>
                <li>Penyesuaian rasio foto profil ke 3:4 dengan sudut membulat.</li>
              </ul>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: '#666' }}>v1.0.0</span>
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                <li>Migrasi aplikasi ke React 19 + Vite.</li>
                <li>Penyempurnaan UI/UX dengan tema professional dark-blue.</li>
                <li>Dukungan PWA (Progressive Web App).</li>
              </ul>
            </div>
          </div>

          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', color: '#791F1F', marginTop: '30px' }}>Dukungan & Donasi</h3>
          <p style={{ fontSize: '13px' }}>Jika aplikasi ini bermanfaat bagi Anda, dukung pengembang untuk terus memperbarui fitur-fitur baru melalui:</p>
          <div style={{ 
            background: '#FCEBEB', 
            border: '1px solid #F09595', 
            borderRadius: '12px', 
            padding: '20px',
            marginTop: '10px'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontWeight: 700, color: '#A32D2D' }}>☕ Saweria:</span><br/>
              <a href="https://saweria.co/fadlirahman87" target="_blank" rel="noreferrer" style={{ color: '#0C447C', wordBreak: 'break-all' }}>https://saweria.co/fadlirahman87</a>
            </div>
            <div>
              <span style={{ fontWeight: 700, color: '#A32D2D' }}>🏦 Transfer Bank:</span><br/>
              <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', marginTop: '5px', border: '1px solid #F09595' }}>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>Bank Kaltimtara</div>
                <div style={{ fontSize: '20px', color: '#0C447C', letterSpacing: '1px', margin: '4px 0' }}>0062322853</div>
                <div style={{ fontSize: '13px', color: '#666' }}>a.n Fadli Rahman</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '50px', fontSize: '11px', color: '#999' }}>
          &copy; 2026 Aplikasi Kartu Soal React · Dibuat dengan ❤️ untuk Pendidikan Indonesia
        </div>
      </div>
    </div>
  );
}

export default TabAbout;
