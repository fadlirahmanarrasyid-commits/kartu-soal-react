import { useState, useRef, useEffect } from 'react';
import MathText from './MathText';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import katex from 'katex';

// Required for Quill's formula module
window.katex = katex;

const LEVEL_LABELS = {
  'C1': 'Mengingat (C1)',
  'C2': 'Memahami (C2)',
  'C3': 'Menerapkan (C3)',
  'C4': 'Menganalisis (C4)',
  'C5': 'Menilai/Evaluasi (C5)',
  'C6': 'Mencipta (C6)'
};



function TabBuat({ soalDB, saveToDB, editIdx, setEditIdx, setActiveTab, showToast }) {
  const [formData, setFormData] = useState({
    mapel: 'Konsentrasi Keahlian Teknik Kendaraan Ringan Otomotif',
    kelas: 'XI / Fase F',
    cp: 'Sistem Kelistrikkan Kendaraan Ringan',
    atp: 'Menganalisis komponen dan rangkaian sistem penerangan kendaraan',
    tp: 'Peserta didik dapat menganalisis komponen dan rangkaian sistem penerangan kendaraan',
    materi: 'Sistem Penerangan',
    indikator: 'Diberikan skema rangkaian sistem penerangan, peserta didik dapat menganalisis aliran arus pada rangkaian tersebut dengan benar.',
    level: 'C4',
    dl: 'Meaningful Learning',
    stimulus: '',
    soal: '',
    hots: 'Analisis Aliran Arus',
    konteks: 'Bengkel Otomotif / Dunia Kerja',
    refleksi: 'Bagaimana perasaanmu setelah berhasil memahami alur listrik yang rumit ini?',
    kunci: '',
    opsi: [
      { huruf: 'A', teks: '', kunci: false },
      { huruf: 'B', teks: '', kunci: false },
      { huruf: 'C', teks: '', kunci: false },
      { huruf: 'D', teks: '', kunci: false },
      { huruf: 'E', teks: '', kunci: false },
    ]
  });

  const lastEditIdx = useRef(null);

  // LOAD DATA SAAT MODE EDIT
  useEffect(() => {
    if (editIdx !== null && editIdx !== lastEditIdx.current) {
      lastEditIdx.current = editIdx;
      const dataToEdit = soalDB[editIdx];
      
      if (dataToEdit) {
        const sanitizedOpsi = dataToEdit.opsi.map(o => ({
          ...o,
          kunci: o.huruf === dataToEdit.kunci
        }));
        
        setFormData({
          ...dataToEdit,
          opsi: sanitizedOpsi
        });
        
      }
    }
    if (editIdx === null) {
      lastEditIdx.current = null;
    }
  }, [editIdx, soalDB]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpsiChange = (index, value) => {
    const newOpsi = [...formData.opsi];
    newOpsi[index].teks = value;
    setFormData({ ...formData, opsi: newOpsi });
  };

  const setKunci = (index) => {
    const selectedLetter = formData.opsi[index].huruf;
    const newOpsi = formData.opsi.map((o, i) => ({ 
      ...o, 
      kunci: i === index 
    }));
    
    setFormData({ 
      ...formData, 
      opsi: newOpsi,
      kunci: selectedLetter
    });
  };

  const simpanSoal = () => {
    const finalData = { ...formData };

    if (!finalData.soal || !finalData.tp) {
      alert('Tujuan Pembelajaran dan Butir Soal wajib diisi!');
      return;
    }
    
    const hasKunci = finalData.opsi.some(o => o.kunci) || finalData.kunci;
    if (!hasKunci) {
      alert('Pilih salah satu kunci jawaban!');
      return;
    }

    let newDB = [...soalDB];
    if (editIdx !== null) {
      newDB[editIdx] = finalData;
      showToast('Soal berhasil diperbarui!');
    } else {
      newDB.push(finalData);
      showToast('Soal berhasil disimpan ke bank soal!');
    }

    saveToDB(newDB);
    lastEditIdx.current = null;
    setEditIdx(null);
    setActiveTab('daftar'); 
  };

  const batalkanEdit = () => {
    lastEditIdx.current = null;
    setEditIdx(null);
    setActiveTab('daftar');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'formula'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'script', 'color', 'background', 'list', 'bullet', 'align',
    'link', 'image', 'formula'
  ];

  return (
    <div className="panel active print-hide">
      <div className="section-card" style={{ borderLeft: editIdx !== null ? '6px solid #E8A838' : '' }}>
        <h3>{editIdx !== null ? '✏️ Edit Soal' : '📝 Identitas & Kisi-kisi'}</h3>
        {editIdx !== null && <p style={{ fontSize: 12, color: '#633806', marginBottom: 15 }}>Anda sedang mengubah soal nomor {editIdx + 1}</p>}
        
        <div className="form-grid">
          <div className="form-group"><label>Mata Pelajaran</label><input type="text" name="mapel" value={formData.mapel} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Kelas / Fase</label><input type="text" name="kelas" value={formData.kelas} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Elemen CP</label><input type="text" name="cp" value={formData.cp} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Tujuan Pembelajaran (TP)</label><input type="text" name="atp" value={formData.atp} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Detail Tujuan Pembelajaran</label><textarea name="tp" value={formData.tp} onChange={handleInputChange}></textarea></div>
          <div className="form-group"><label>Materi Pokok</label><input type="text" name="materi" value={formData.materi} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Indikator Soal</label><textarea name="indikator" value={formData.indikator} onChange={handleInputChange}></textarea></div>
          <div className="form-group"><label>Level Kognitif</label>
            <select name="level" value={formData.level} onChange={handleInputChange}>
              {Object.entries(LEVEL_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div className="form-group"><label>Pendekatan Deep Learning</label>
            <select name="dl" value={formData.dl} onChange={handleInputChange}>
              <option>Mindful Learning</option><option>Meaningful Learning</option><option>Joyful Learning</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>💡 Konten Soal (Rich Text Editor)</h3>
        <div className="form-group">
          <label>Stimulus Soal (Opsional)</label>
          <div className="editor-container" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }}>
            <ReactQuill
              theme="snow"
              value={formData.stimulus}
              onChange={(content) => setFormData(prev => ({ ...prev, stimulus: content }))}
              modules={quillModules}
              formats={quillFormats}
              style={{ height: '200px', marginBottom: '40px' }}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Butir Soal</label>
          <div className="editor-container" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <ReactQuill
              theme="snow"
              value={formData.soal}
              onChange={(content) => setFormData(prev => ({ ...prev, soal: content }))}
              modules={quillModules}
              formats={quillFormats}
              style={{ height: '250px', marginBottom: '40px' }}
            />
          </div>
        </div>

        <div className="preview-mini" style={{ marginTop: 15, background: '#f8f9fa', padding: 10, borderRadius: 8, fontSize: 12 }}>
          <strong>Pratinjau Live (LaTeX):</strong>
          <div style={{ marginTop: 5 }}>
            <MathText text={formData.stimulus} style={{ fontStyle: 'italic', color: '#555' }} />
            <MathText text={formData.soal} style={{ fontWeight: 'bold' }} />
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>🔘 Pilihan Jawaban</h3>
        <div className="opsi-list">
          {formData.opsi.map((o, i) => (
            <div key={i} className={`opsi-row ${o.kunci ? 'kunci' : ''}`}>
              {/* Radio Button untuk memilih kunci jawaban */}
              <input 
                type="radio" 
                name="kunci-jawaban" 
                checked={o.kunci} 
                onChange={() => setKunci(i)}
                style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: '#1D9E75' }}
              />
              <div className="opsi-label">{o.huruf}</div>
              <input
                type="text"
                placeholder={`Teks pilihan ${o.huruf}...`}
                value={o.teks}
                onChange={(e) => handleOpsiChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3>🔍 Metadata HOTs & Refleksi</h3>
        <div className="form-grid">
          <div className="form-group"><label>Jenis Penalaran HOTs</label><input type="text" name="hots" value={formData.hots} onChange={handleInputChange} /></div>
          <div className="form-group"><label>Konteks Dunia Kerja</label><input type="text" name="konteks" value={formData.konteks} onChange={handleInputChange} /></div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}><label>Pertanyaan Refleksi</label><input type="text" name="refleksi" value={formData.refleksi} onChange={handleInputChange} /></div>
        </div>
      </div>

      <div style={{ marginBottom: '40px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary" onClick={simpanSoal}>
          {editIdx !== null ? '💾 Simpan Perubahan' : '💾 Simpan ke Bank Soal'}
        </button>
        {editIdx !== null ? (
          <button className="btn-secondary" style={{ background: '#666' }} onClick={batalkanEdit}>❌ Batal Edit</button>
        ) : (
          <button className="btn-secondary" onClick={() => window.location.reload()}>🔄 Reset Form</button>
        )}
      </div>
    </div>
  );
}

export default TabBuat;
