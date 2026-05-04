import { useState } from 'react';

const dlInfoData = {
  mindful: {
    desc: "Mindful Learning mendorong peserta didik untuk hadir penuh dalam proses belajar, sadar akan proses berpikir mereka sendiri (metakognisi), dan tidak sekadar menghafal prosedur.",
    tips: [
      "Soal dirancang agar siswa merefleksikan proses berpikir mereka",
      "Berikan stimulus yang memerlukan perhatian penuh",
      "Sertakan pertanyaan refleksi: Mengapa kamu memilih jawaban ini?",
      "Gunakan skenario yang memerlukan pengamatan teliti"
    ]
  },
  meaningful: {
    desc: "Meaningful Learning menekankan bahwa pengetahuan baru harus terhubung dengan pengetahuan yang sudah ada dan bermakna secara kontekstual.",
    tips: [
      "Kaitkan soal dengan pengalaman dunia kerja otomotif",
      "Gunakan data atau kasus dari bengkel lokal / industri",
      "Buat peserta didik melihat relevansi materi dengan karir",
      "Bangun soal bertingkat: konsep → penerapan → pemecahan masalah"
    ]
  },
  joyful: {
    desc: "Joyful Learning menciptakan pengalaman belajar yang menyenangkan dan memotivasi. Soal dirancang agar menantang namun tidak menakutkan.",
    tips: [
      "Gunakan skenario menarik dan dekat dengan kehidupan siswa",
      "Buat pilihan jawaban yang plausibel namun jelas perbedaannya",
      "Hindari pengecoh yang menjebak secara tidak fair",
      "Berikan apresiasi melalui umpan balik bermakna"
    ]
  }
};

function TabDeepLearning({ soalDB }) {
  const [activeDL, setActiveDL] = useState('mindful');

  const lot = soalDB.filter((s) => ['C1', 'C2'].includes(s.level)).length;
  const mot = soalDB.filter((s) => ['C3', 'C4'].includes(s.level)).length;
  const hot = soalDB.filter((s) => ['C5', 'C6'].includes(s.level)).length;

  const info = dlInfoData[activeDL];

  return (
    <div className="panel active print-hide">
      <div className="section-card">
        <h3>Panduan Pendekatan Deep Learning — Kurikulum Merdeka</h3>
        <div className="dl-tag-grid">
          <div className={`dl-tag ${activeDL === 'mindful' ? 'active' : ''}`} onClick={() => setActiveDL('mindful')}>Mindful Learning</div>
          <div className={`dl-tag ${activeDL === 'meaningful' ? 'active' : ''}`} onClick={() => setActiveDL('meaningful')}>Meaningful Learning</div>
          <div className={`dl-tag ${activeDL === 'joyful' ? 'active' : ''}`} onClick={() => setActiveDL('joyful')}>Joyful Learning</div>
        </div>
        <div className="dl-info">
          <div style={{ fontSize: 12, marginBottom: 8, lineHeight: 1.6 }}>{info.desc}</div>
          {info.tips.map((t, i) => (
            <div key={i} className="kartu-dl-item" style={{ fontSize: 12, color: '#666' }}>{t}</div>
          ))}
        </div>
      </div>

      <div className="section-card">
        <h3>Taksonomi Bloom &amp; HOTs — Distribusi Ideal</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          <div style={{ background: '#E6F1FB', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0C447C', marginBottom: 4 }}>LOTs (C1–C2)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#0C447C' }}>{lot}</div>
            <div style={{ fontSize: 10, color: '#185FA5' }}>Mengingat · Memahami</div>
            <div style={{ fontSize: 10, color: '#185FA5', marginTop: 2 }}>Ideal ≤ 20%</div>
          </div>
          <div style={{ background: '#EEEDFE', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3C3489', marginBottom: 4 }}>MOTs (C3–C4)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#3C3489' }}>{mot}</div>
            <div style={{ fontSize: 10, color: '#534AB7' }}>Menerapkan · Menganalisis</div>
            <div style={{ fontSize: 10, color: '#534AB7', marginTop: 2 }}>Ideal 40–50%</div>
          </div>
          <div style={{ background: '#E1F5EE', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#085041', marginBottom: 4 }}>HOTs (C5–C6)</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#085041' }}>{hot}</div>
            <div style={{ fontSize: 10, color: '#0F6E56' }}>Mengevaluasi · Mencipta</div>
            <div style={{ fontSize: 10, color: '#0F6E56', marginTop: 2 }}>Ideal ≥ 30%</div>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>Tips Penulisan Soal Berbasis Deep Learning</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: '#FAEEDA', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#633806', marginBottom: 4 }}>Gunakan stimulus autentik</div>
            <div style={{ fontSize: 11, color: '#854F0B', lineHeight: 1.6 }}>Awali soal dengan kasus nyata, data, atau skenario DU/DI yang relevan</div>
          </div>
          <div style={{ background: '#E1F5EE', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#085041', marginBottom: 4 }}>Dorong penalaran tinggi</div>
            <div style={{ fontSize: 11, color: '#0F6E56', lineHeight: 1.6 }}>Gunakan kata kerja HOTs: analisis, evaluasi, bandingkan, simpulkan, rancang</div>
          </div>
          <div style={{ background: '#EEEDFE', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#3C3489', marginBottom: 4 }}>Kontekstualisasi lokal</div>
            <div style={{ fontSize: 11, color: '#534AB7', lineHeight: 1.6 }}>Kaitkan dengan industri dan konteks daerah agar bermakna bagi peserta didik</div>
          </div>
          <div style={{ background: '#FCEBEB', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#791F1F', marginBottom: 4 }}>Hindari hafalan murni</div>
            <div style={{ fontSize: 11, color: '#A32D2D', lineHeight: 1.6 }}>Batasi C1–C2 maksimal 20%. Prioritaskan C3 ke atas untuk deep learning</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabDeepLearning;
