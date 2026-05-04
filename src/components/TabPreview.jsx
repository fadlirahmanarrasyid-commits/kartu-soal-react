import { useState } from 'react';

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

                <div className="kartu-header">
                  <h2>Nomor Soal: {realIdx + 1}</h2>
                  <span>{s.level} &nbsp;|&nbsp; {s.dl}</span>
                </div>
                <div className="kartu-body">
                  <div className="kartu-meta-grid">
                    <div className="kartu-meta-row"><div className="mk">Mata Pelajaran</div><div className="mv">{s.mapel}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Kelas / Fase</div><div className="mv">{s.kelas}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Elemen CP</div><div className="mv">{s.cp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Alur TP</div><div className="mv">{s.atp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Tujuan Pembelajaran</div><div className="mv">{s.tp}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Materi Pokok</div><div className="mv">{s.materi}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Indikator Soal</div><div className="mv">{s.indikator}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Level Kognitif</div><div className="mv">{s.level}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Pendekatan DL</div><div className="mv">{s.dl}</div></div>
                    <div className="kartu-meta-row"><div className="mk">Kunci Jawaban</div><div className="mv" style={{ fontWeight: 700, color: '#27500A' }}>{s.kunci}</div></div>
                  </div>

                  {s.stimulus && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#3C3489', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Stimulus / Konteks</div>
                      <div style={{ background: '#F4F3FE', borderLeft: '3px solid #534AB7', padding: '8px 10px', borderRadius: '0 8px 8px 0', fontSize: 12, lineHeight: 1.6 }}>{s.stimulus}</div>
                    </div>
                  )}

                  {s.image && (
                    <div style={{ marginTop: 12, textAlign: 'center', background: '#f9f9f9', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                      <img src={s.image} alt="Stimulus Visual" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '4px', display: 'block', margin: '0 auto' }} />
                    </div>
                  )}
                  <div className="kartu-soal-box">{s.soal}</div>
                  
                  <div className="opsi-grid">
                    {s.opsi.map((o, i) => (
                      <div key={i} className={`opsi-kartu ${o.kunci ? 'k' : ''}`}>
                        <span className="opsi-lbl">{o.huruf}.</span>
                        <span>{o.teks}</span>
                      </div>
                    ))}
                  </div>

                  <div className="kartu-dl-box">
                    <h4>Strategi Deep Learning</h4>
                    <div className="kartu-dl-item">HOTs: {s.hots || '-'}</div>
                    <div className="kartu-dl-item">Konteks: {s.konteks || '-'}</div>
                    {s.refleksi && <div className="kartu-dl-item">Refleksi: {s.refleksi}</div>}
                  </div>

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
