import { useState } from 'react';

function TabSettings({ settings, setSettings, showToast }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        setLocalSettings(prev => ({ ...prev, logoSekolah: readerEvent.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setSettings(localSettings);
    showToast('Pengaturan berhasil disimpan ✨');
  };

  return (
    <div className="panel active print-hide">
      <div className="section-card">
        <h3>⚙️ Pengaturan Identitas Sekolah & Asesmen</h3>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '16px' }}>
          Informasi ini akan ditampilkan pada kop kartu soal dan kisi-kisi saat dicetak.
        </p>

        <div className="form-grid">
          <div className="form-group full">
            <label>Nama Asesmen</label>
            <input
              name="namaAsesmen"
              value={localSettings.namaAsesmen}
              onChange={handleChange}
              placeholder="Contoh: Asesmen Sumatif Akhir Semester (ASAS)"
            />
          </div>

          <div className="form-group">
            <label>Nama Sekolah</label>
            <input
              name="namaSekolah"
              value={localSettings.namaSekolah}
              onChange={handleChange}
              placeholder="Nama Sekolah Anda"
            />
          </div>

          <div className="form-group">
            <label>Tahun Pelajaran</label>
            <input
              name="tahunPelajaran"
              value={localSettings.tahunPelajaran}
              onChange={handleChange}
              placeholder="2025/2026"
            />
          </div>

          <div className="form-group">
            <label>Nama Penyusun</label>
            <input
              name="namaPenyusun"
              value={localSettings.namaPenyusun}
              onChange={handleChange}
              placeholder="Nama Lengkap & Gelar"
            />
          </div>

          <div className="form-group">
            <label>NIP/NUPTK Penyusun</label>
            <input
              name="nipPenyusun"
              value={localSettings.nipPenyusun}
              onChange={handleChange}
              placeholder="Masukkan NIP atau -"
            />
          </div>

          <div className="form-group">
            <label>Nama Kepala Sekolah</label>
            <input
              name="namaKepalaSekolah"
              value={localSettings.namaKepalaSekolah}
              onChange={handleChange}
              placeholder="Nama Kepala Sekolah"
            />
          </div>

          <div className="form-group">
            <label>NIP Kepala Sekolah</label>
            <input
              name="nipKepalaSekolah"
              value={localSettings.nipKepalaSekolah}
              onChange={handleChange}
              placeholder="NIP Kepala Sekolah"
            />
          </div>

          <div className="form-group full">
            <label>Logo Sekolah</label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '4px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  border: '2px dashed #ccc',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: '#f9f9f9'
                }}
              >
                {localSettings.logoSekolah ? (
                  <img src={localSettings.logoSekolah} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '20px' }}>🏫</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ fontSize: '12px' }} />
                <p style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>Rekomendasi: File PNG/JPG transparan, max 500KB.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px', textAlign: 'right' }}>
          <button className="btn-primary" onClick={handleSave}>💾 Simpan Semua Pengaturan</button>
        </div>
      </div>
    </div>
  );
}

export default TabSettings;
