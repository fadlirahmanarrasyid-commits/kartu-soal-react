import { useState, useEffect } from 'react';

const defaultForm = {
  mapel: 'Teknik Kendaraan Ringan Otomotif',
  kelas: 'X / Fase E',
  cp: 'Sistem Penerangan Kendaraan',
  atp: 'Menganalisis komponen dan rangkaian sistem penerangan',
  level: 'C4',
  dl: 'Mindful Learning',
  tp: 'Peserta didik dapat menganalisis fungsi dan cara kerja komponen sistem penerangan kendaraan',
  materi: 'Komponen sistem penerangan kendaraan',
  indikator: 'Peserta didik dapat menganalisis penyebab kerusakan pada sistem penerangan kendaraan',
  stimulus: 'Seorang teknisi menemukan bahwa lampu kepala sebelah kiri tidak menyala. Tegangan soket 12V normal, sekering dan relay baik.',
  soal: 'Berdasarkan gejala tersebut, komponen manakah yang paling mungkin mengalami kerusakan?',
  hots: 'Analisis kausalitas dan pemecahan masalah berbasis data',
  konteks: 'Kasus nyata di bengkel otomotif',
  refleksi: 'Bagaimana prosedur diagnosis sistematis mencegah kesalahan penggantian komponen?',
  image: null
};

const defaultOpsi = [
  { huruf: 'A', teks: 'Relay lampu mengalami kerusakan internal', kunci: false },
  { huruf: 'B', teks: 'Kabel massa (ground) lampu putus atau longgar', kunci: false },
  { huruf: 'C', teks: 'Sekering sub-circuit lampu kepala kiri putus', kunci: false },
  { huruf: 'D', teks: 'Filamen bola lampu putus (open circuit)', kunci: true },
  { huruf: 'E', teks: 'Saklar dim tidak berfungsi pada posisi low beam', kunci: false }
];

function TabBuat({ soalDB, saveToDB, editIdx, setEditIdx, setActiveTab, showToast }) {
  const [form, setForm] = useState(defaultForm);
  const [opsi, setOpsi] = useState(defaultOpsi);

  useEffect(() => {
    if (editIdx !== null && soalDB[editIdx]) {
      const s = soalDB[editIdx];
      setForm({
        mapel: s.mapel || '', kelas: s.kelas || '', cp: s.cp || '', atp: s.atp || '',
        level: s.level || 'C1', dl: s.dl || 'Mindful Learning', tp: s.tp || '',
        materi: s.materi || '', indikator: s.indikator || '', stimulus: s.stimulus || '',
        soal: s.soal || '', hots: s.hots || '', konteks: s.konteks || '', refleksi: s.refleksi || '',
        image: s.image || null
      });
      setOpsi(s.opsi || defaultOpsi);
    } else {
      setForm(defaultForm);
      setOpsi(defaultOpsi);
    }
  }, [editIdx, soalDB]);

  const lot = soalDB.filter((s) => ['C1', 'C2'].includes(s.level)).length;
  const mot = soalDB.filter((s) => ['C3', 'C4'].includes(s.level)).length;
  const hot = soalDB.filter((s) => ['C5', 'C6'].includes(s.level)).length;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id.replace('f-', '')]: value }));
  };

  const handleOpsiChange = (index, value) => {
    const newOpsi = [...opsi];
    newOpsi[index].teks = value;
    setOpsi(newOpsi);
  };

  const handleKunciChange = (index) => {
    const newOpsi = opsi.map((o, i) => ({ ...o, kunci: i === index }));
    setOpsi(newOpsi);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { // Max 1MB
      alert('Ukuran gambar terlalu besar (Maksimal 1MB)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    const fileInput = document.getElementById('f-image');
    if (fileInput) fileInput.value = '';
  };

  const tambahSoal = () => {
    if (!opsi.every(o => o.teks.trim())) {
      alert('Isi semua pilihan jawaban.');
      return;
    }
    const kunciIdx = opsi.findIndex(o => o.kunci);
    const soalObj = {
      ...form,
      opsi,
      kunci: ['A', 'B', 'C', 'D', 'E'][kunciIdx]
    };

    let newDB = [...soalDB];
    if (editIdx !== null) {
      newDB[editIdx] = soalObj;
      setEditIdx(null);
    } else {
      newDB.push(soalObj);
    }
    
    saveToDB(newDB);
    showToast('Soal berhasil disimpan');
    bersihkanForm();
    setActiveTab('daftar');
  };

  const bersihkanForm = () => {
    setForm(defaultForm);
    setOpsi(defaultOpsi);
    setEditIdx(null);
  };

  return (
    <div className="panel active print-hide">
      <div className="stat-grid">
        <div className="stat"><div className="stat-val">{soalDB.length}</div><div className="stat-lbl">Total Soal</div></div>
        <div className="stat"><div className="stat-val">{lot}</div><div className="stat-lbl">C1–C2</div></div>
        <div className="stat"><div className="stat-val">{mot}</div><div className="stat-lbl">C3–C4</div></div>
        <div className="stat"><div className="stat-val">{hot}</div><div className="stat-lbl">C5–C6</div></div>
      </div>

      <div className="section-card">
        <h3>Identitas Soal</h3>
        <div className="form-grid">
          <div className="form-group"><label>Mata Pelajaran</label><input type="text" id="f-mapel" value={form.mapel} onChange={handleChange} /></div>
          <div className="form-group"><label>Kelas / Fase</label>
            <select id="f-kelas" value={form.kelas} onChange={handleChange}>
              <option>X / Fase E</option><option>XI / Fase F</option><option>XII / Fase F</option>
            </select>
          </div>
          <div className="form-group"><label>Elemen CP</label><input type="text" id="f-cp" value={form.cp} onChange={handleChange} /></div>
          <div className="form-group"><label>Alur TP</label><input type="text" id="f-atp" value={form.atp} onChange={handleChange} /></div>
          <div className="form-group"><label>Level Kognitif</label>
            <select id="f-level" value={form.level} onChange={handleChange}>
              <option value="C1">C1 – Mengingat</option>
              <option value="C2">C2 – Memahami</option>
              <option value="C3">C3 – Menerapkan</option>
              <option value="C4">C4 – Menganalisis</option>
              <option value="C5">C5 – Mengevaluasi</option>
              <option value="C6">C6 – Mencipta</option>
            </select>
          </div>
          <div className="form-group"><label>Pendekatan DL</label>
            <select id="f-dl" value={form.dl} onChange={handleChange}>
              <option>Mindful Learning</option><option>Meaningful Learning</option><option>Joyful Learning</option>
            </select>
          </div>
          <div className="form-group"><label>Tujuan Pembelajaran</label><textarea id="f-tp" value={form.tp} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Materi Pokok</label><input type="text" id="f-materi" value={form.materi} onChange={handleChange} /></div>
          <div className="form-group full"><label>Indikator Soal</label><input type="text" id="f-indikator" value={form.indikator} onChange={handleChange} /></div>
          <div className="form-group"><label>Stimulus / Konteks</label><textarea id="f-stimulus" value={form.stimulus} onChange={handleChange}></textarea></div>
          <div className="form-group"><label>Pertanyaan Soal</label><textarea id="f-soal" value={form.soal} onChange={handleChange}></textarea></div>
          <div className="form-group full">
            <label>🖼️ Tambahkan Gambar (Opsional)</label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: '#F9F9F9', padding: 12, borderRadius: 8, border: '1px dashed #ccc' }}>
              {form.image ? (
                <div style={{ position: 'relative' }}>
                  <img src={form.image} alt="Preview" style={{ maxWidth: 200, maxHeight: 150, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  <button 
                    onClick={removeImage}
                    style={{ position: 'absolute', top: -8, right: -8, background: '#A32D2D', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <input type="file" id="f-image" accept="image/*" onChange={handleImageChange} style={{ fontSize: 13 }} />
                  <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Format: JPG, PNG, GIF. Maksimal 1MB. Gambar akan tampil di kartu soal.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>Strategi Deep Learning</h3>
        <div className="form-grid">
          <div className="form-group"><label>HOTs yang Ditarget</label><input type="text" id="f-hots" value={form.hots} onChange={handleChange} /></div>
          <div className="form-group"><label>Kontekstualitas</label><input type="text" id="f-konteks" value={form.konteks} onChange={handleChange} /></div>
          <div className="form-group full"><label>Pertanyaan Refleksi</label><input type="text" id="f-refleksi" value={form.refleksi} onChange={handleChange} /></div>
        </div>
      </div>

      <div className="section-card">
        <h3>Pilihan Jawaban</h3>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>Pilih radio button untuk menandai kunci jawaban</p>
        <div>
          {opsi.map((o, i) => (
            <div className="opsi-row" key={i}>
              <input type="radio" name="kunci" checked={o.kunci} onChange={() => handleKunciChange(i)} />
              <div className={`opsi-label ${o.kunci ? 'kunci' : ''}`}>{o.huruf}</div>
              <input type="text" placeholder={`Pilihan ${o.huruf}...`} value={o.teks} onChange={(e) => handleOpsiChange(i, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="opsi-hint">Tandai salah satu opsi sebagai kunci jawaban</div>
      </div>

      <div className="row">
        <button className="btn-primary" onClick={tambahSoal}>✓ Simpan Soal</button>
        <button className="btn-secondary" onClick={bersihkanForm}>Bersihkan</button>
        <div className="spacer"></div>
        {editIdx !== null && (
          <span style={{ fontSize: 12, color: '#555' }}>
            Mode edit — <a href="#" onClick={(e) => { e.preventDefault(); bersihkanForm(); }} style={{ color: '#0C447C' }}>batal</a>
          </span>
        )}
      </div>
    </div>
  );
}

export default TabBuat;
