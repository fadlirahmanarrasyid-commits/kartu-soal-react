import { useState } from 'react';
import { saveAs } from 'file-saver';
import MathText from './MathText';

const LEVEL_LABELS = {
  'C1': 'Mengingat (C1)',
  'C2': 'Memahami (C2)',
  'C3': 'Menerapkan (C3)',
  'C4': 'Menganalisis (C4)',
  'C5': 'Menilai/Evaluasi (C5)',
  'C6': 'Mencipta (C6)'
};

function TabPreview({ soalDB, settings }) {
  const [previewSelect, setPreviewSelect] = useState('all');

  const cetakSemua = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const data = previewSelect === 'all' ? soalDB : [soalDB[parseInt(previewSelect)]].filter(Boolean);

  return (
    <div className="panel active">
      <div className="row print-hide" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#666' }}>Pratinjau kartu soal</span>
        <div className="spacer"></div>
        <div style={{ display: 'flex', gap: '8px' }} className="print-hide">
          <select
            id="preview-select"
            style={{ fontSize: 12, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}
            value={previewSelect}
            onChange={(e) => setPreviewSelect(e.target.value)}
          >
            <option value="all">Semua soal</option>
            {soalDB.map((_, i) => (
              <option key={i} value={i}>Soal {i + 1}</option>
            ))}
          </select>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={cetakSemua}>🖨️ Cetak</button>
        </div>
      </div>

      <div className="kartu-preview">
        {data.length === 0 ? (
          <div className="empty">Belum ada soal.</div>
        ) : (
          data.map((s, idx) => {
            const realIdx = previewSelect === 'all' ? idx : parseInt(previewSelect);
            return (
              <div className="kartu" key={realIdx}>
                {/* KOP SURAT / IDENTITY HEADER */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px', 
                  borderBottom: '2px solid #0C447C',
                  background: '#fcfcfc'
                }}>
                  {settings.logoSekolah && (
                    <img src={settings.logoSekolah} alt="Logo" style={{ height: '50px', width: 'auto', marginRight: '16px' }} />
                  )}
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '14px', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>KARTU SOAL</h1>
                    <h2 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 0 0' }}>{settings.namaAsesmen}</h2>
                    <p style={{ fontSize: '11px', margin: '2px 0 0 0' }}>{settings.namaSekolah} · TP {settings.tahunPelajaran}</p>
                  </div>
                  <div style={{ width: settings.logoSekolah ? '50px' : '0' }}></div>
                </div>

                <div className="kartu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#f0f4f8', borderBottom: '1px solid #d1d9e0' }}>
                  <h2 style={{ fontSize: '14px', margin: 0, color: '#0C447C' }}>Nomor Soal: {realIdx + 1}</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: '#e1f5fe', color: '#01579b', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: '1px solid #b3e5fc' }}>{LEVEL_LABELS[s.level] || s.level}</span>
                    <span style={{ background: '#f3e5f5', color: '#4a148c', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: '1px solid #e1bee7' }}>{s.dl}</span>
                    <span style={{ background: '#e8f5e9', color: '#1b5e20', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, border: '1px solid #c8e6c9' }}>Kunci: {s.kunci}</span>
                  </div>
                </div>
                <div className="kartu-body">
                  <div className="kartu-meta-grid">
                    <div className="kartu-meta-row"><div className="mk">Mata Pelajaran</div><div className="mv">{s.mapel}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Kelas / Fase</div><div className="mv">{s.kelas}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Elemen CP</div><div className="mv">{s.cp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Tujuan Pembelajaran (TP)</div><div className="mv">{s.atp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Butir TP</div><div className="mv">{s.tp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Materi Pokok</div><div className="mv">{s.materi}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Indikator Soal</div><div className="mv">{s.indikator}</div></div>
                  </div>

                  {s.stimulus && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#3C3489', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Stimulus / Konteks</div>
                      <div style={{ background: '#F4F3FE', borderLeft: '3px solid #534AB7', padding: '8px 10px', borderRadius: '0 8px 8px 0', fontSize: 12, lineHeight: 1.6 }}>
                        <MathText text={s.stimulus} />
                      </div>
                    </div>
                  )}

                  {s.image && (
                    <div style={{ marginTop: 12, textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <img src={s.image} alt="Stimulus Visual" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '4px', display: 'block', margin: '0 auto' }} />
                    </div>
                  )}
                  <div className="kartu-soal-box">
                    <MathText text={s.soal} />
                  </div>
                  
                  <div className="opsi-grid">
                    {s.opsi.map((o, i) => (
                      <div key={i} className={`opsi-kartu ${o.kunci ? 'k' : ''}`}>
                        <span className="opsi-lbl">{o.huruf}.</span>
                        <MathText text={o.teks} style={{ display: 'inline' }} />
                      </div>
                    ))}
                  </div>

                  <div className="kartu-dl-box">
                    <h4>Strategi Deep Learning</h4>
                    <div className="kartu-dl-item">HOTs: {s.hots || '-'}</div>
                    <div className="kartu-dl-item">Konteks: {s.konteks || '-'}</div>
                    {s.refleksi && <div className="kartu-dl-item">Refleksi: {s.refleksi}</div>}
                  </div>

                  {idx === data.length - 1 && (
                    <div style={{ 
                      marginTop: '20px', 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '40px',
                      fontSize: '11px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <p>Mengetahui,</p>
                        <p style={{ marginBottom: '50px' }}>Kepala Sekolah</p>
                        <p style={{ fontWeight: 700, textDecoration: 'underline' }}>{settings.namaKepalaSekolah}</p>
                        <p>NIP. {settings.nipKepalaSekolah}</p>
                      </div>
                      <div>
                        <p>&nbsp;</p>
                        <p style={{ marginBottom: '50px' }}>Penyusun,</p>
                        <p style={{ fontWeight: 700, textDecoration: 'underline' }}>{settings.namaPenyusun}</p>
                        <p>NIP. {settings.nipPenyusun}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TabPreview;
