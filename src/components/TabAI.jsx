import { useState } from 'react';
import MathText from './MathText';

const LEVEL_LABELS = {
  'C1': 'Mengingat (C1)',
  'C2': 'Memahami (C2)',
  'C3': 'Menerapkan (C3)',
  'C4': 'Menganalisis (C4)',
  'C5': 'Menilai/Evaluasi (C5)',
  'C6': 'Mencipta (C6)'
};

function TabAI({ soalDB, saveToDB, showToast }) {
  const [mode, setMode] = useState('api');
  const [provider, setProvider] = useState('gemini'); // Default to gemini
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const [mapel, setMapel] = useState('Konsentrasi Keahlian Teknik Kendaraan Ringan Otomotif');
  const [kelas, setKelas] = useState('XI / Fase F');
  const [cp, setCp] = useState('Sistem Kelistrikkan Kendaraan Ringan');
  const [atp, setAtp] = useState('Menganalisis komponen dan rangkaian sistem penerangan kendaraan');

  const [distMudah, setDistMudah] = useState(1);
  const [distSedang, setDistSedang] = useState(2);
  const [distMahir, setDistMahir] = useState(2);

  const totalTP = distMudah + distSedang + distMahir;

  const [loadingKisi, setLoadingKisi] = useState(false);
  const [errorKisi, setErrorKisi] = useState('');
  const [aiKisiData, setAiKisiData] = useState([]);
  const [selectedKisi, setSelectedKisi] = useState([]);

  const [loadingSoal, setLoadingSoal] = useState(false);
  const [errorSoal, setErrorSoal] = useState('');
  const [aiSoalData, setAiSoalData] = useState([]);

  const [pasteKisi, setPasteKisi] = useState('');
  const [pasteSoal, setPasteSoal] = useState('');
  const [copiedKisi, setCopiedKisi] = useState(false);
  const [copiedSoal, setCopiedSoal] = useState(false);

  // Helper for Claude API
  const callClaude = async (systemPrompt, userPrompt) => {
    if (!apiKey) throw new Error('API key belum dimasukkan. Silakan isi API key Anthropic terlebih dahulu.');
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-3-5-sonnet-20241022', max_tokens: 4096, system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err.error && err.error.message) || `API error: ${res.status}`);
    }
    const data = await res.json();
    return data.content[0].text;
  };

  const callChatGPT = async (systemPrompt, userPrompt) => {
    if (!apiKey) throw new Error('API key belum dimasukkan. Silakan isi API key OpenAI (ChatGPT) terlebih dahulu.');
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ 
        model: 'gpt-4o-mini', 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err.error && err.error.message) || `API error: ${res.status}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const callGemini = async (systemPrompt, userPrompt) => {
    if (!apiKey) throw new Error('API key belum dimasukkan. Silakan isi API key Google Gemini terlebih dahulu.');
    
    const combinedPrompt = `Sistem: ${systemPrompt}\n\nUser: ${userPrompt}`;

    const doFetch = async () => {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: combinedPrompt }] }],
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ],
          generationConfig: { 
            temperature: 0.8, 
            maxOutputTokens: 4096,
            topP: 0.95
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err.error && err.error.message) || `API error: ${res.status}`);
      }
      const data = await res.json();
      
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Konten diblokir oleh Google: ${data.promptFeedback.blockReason}`);
      }

      if (!data.candidates || !data.candidates[0].content) {
        throw new Error('Gemini tidak memberikan jawaban. Cek kuota atau coba lagi.');
      }
      return data.candidates[0].content.parts[0].text;
    };

    try {
      return await doFetch();
    } catch (e) {
      console.warn('Percobaan pertama gagal, mencoba lagi...', e);
      return await doFetch(); 
    }
  };

  const callAI = async (sys, user) => {
    if (provider === 'claude') return await callClaude(sys, user);
    if (provider === 'chatgpt') return await callChatGPT(sys, user);
    return await callGemini(sys, user);
  };

  const extractJSON = (raw) => {
    // 1. Bersihkan karakter aneh dan spasi di ujung
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    
    const tryParse = (str) => {
      try { return JSON.parse(str); } catch (e) { return null; }
    };

    // 2. Cari blok array [ ... ]
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    
    if (start !== -1 && end !== -1 && end >= start) {
      const jsonPart = cleaned.substring(start, end + 1);
      
      // Strategi 1: Parse Standar
      try {
        return JSON.parse(jsonPart);
      } catch (e1) {
        // Strategi 2: Nuclear - Gunakan Function Constructor dengan proteksi backslash
        try {
          // KUNCI PERBAIKAN: Gandakan semua backslash agar \begin tidak menjadi backspace
          const escapedPart = jsonPart.replace(/\\/g, '\\\\');
          const result = new Function(`return ${escapedPart}`)();
          if (result && typeof result === 'object') {
            return Array.isArray(result) ? result : [result];
          }
        } catch (e2) {
          console.error("Gagal ekstraksi manual:", e2);
        }
      }
    }

    // Coba untuk objek tunggal { ... }
    const startObj = cleaned.indexOf('{');
    const endObj = cleaned.lastIndexOf('}');
    if (startObj !== -1 && endObj !== -1 && endObj >= startObj) {
      const jsonPart = cleaned.substring(startObj, endObj + 1);
      try {
        const escapedPart = jsonPart.replace(/\\/g, '\\\\');
        const result = new Function(`return ${escapedPart}`)();
        if (result && typeof result === 'object') return [result];
      } catch (e) { }
    }

    throw new Error('Format data tidak valid. Pastikan Anda menyalin mulai dari tanda [ sampai ] secara utuh.');
  };

  const buildKisiPrompt = () => {
    return `Buat kisi-kisi soal pilihan ganda dengan TEPAT ${totalTP} Tujuan Pembelajaran (tidak boleh lebih, tidak boleh kurang).

Data:
- Mata Pelajaran: ${mapel}
- Kelas/Fase: ${kelas}
- Elemen CP: ${cp}
- Tujuan Pembelajaran (TP): 
${atp}

ATURAN WAJIB:
1. Jika data TP di atas berupa DAFTAR (lebih dari satu), gunakan detail tersebut sebagai acuan utama baris kisi-kisi.
2. Jumlah TP dalam JSON hasil harus TEPAT ${totalTP} — ini aturan paling penting.
2. Distribusi tingkat: ${distMudah} TP Mudah (C1-C2), ${distSedang} TP Sedang (C3-C4), ${distMahir} TP Mahir (C5-C6).
3. Urutkan dari Mudah ke Mahir. Penomoran no dari 1 sampai ${totalTP}.
4. JANGAN tambahkan field "dl" — Pendekatan DL akan dipilih oleh user.

Kembalikan HANYA JSON murni tanpa markdown:
[{"no":1,"tp":"Tujuan Pembelajaran lengkap","materi":"Materi pokok singkat","indikator":"Indikator soal lengkap","level":"C1","tingkat":"Mudah"}]

Nilai tingkat hanya: Mudah, Sedang, atau Mahir. Nilai level hanya: C1, C2, C3, C4, C5, atau C6.`;
  };

  const generateKisiKisi = async () => {
    if (!mapel || !cp || !atp) { alert('Lengkapi Mata Pelajaran, Elemen CP, dan Tujuan Pembelajaran (TP).'); return; }
    if (totalTP < 1) { alert('Total TP minimal 1.'); return; }

    setLoadingKisi(true); setErrorKisi(''); setAiKisiData([]); setSelectedKisi([]); setAiSoalData([]);

    const sysPrompt = 'Kamu adalah ahli pengembangan kurikulum Kurikulum Merdeka Indonesia untuk SMK. Jawab dalam Bahasa Indonesia. Kembalikan HANYA JSON murni tanpa markdown, tanpa kode blok, tanpa teks apapun di luar JSON. SANGAT PENTING: jumlah objek dalam array JSON harus TEPAT sama dengan jumlah TP yang diminta.';
    const userPrompt = buildKisiPrompt();

    try {
      const raw = await callAI(sysPrompt, userPrompt);
      let data = extractJSON(raw);
      if (data.length > totalTP) data = data.slice(0, totalTP);

      const mappedData = data.map(item => ({
        ...item,
        dl: item.tingkat === 'Mudah' ? 'Joyful Learning' : item.tingkat === 'Sedang' ? 'Meaningful Learning' : 'Mindful Learning',
        selected: false
      }));
      setAiKisiData(mappedData);
    } catch (e) {
      setErrorKisi(e.message);
    } finally {
      setLoadingKisi(false);
    }
  };

  const handleKisiSelect = (index) => {
    const newData = [...aiKisiData];
    newData[index].selected = !newData[index].selected;
    setAiKisiData(newData);
  };

  const handleKisiSelectAll = (e) => {
    const checked = e.target.checked;
    const newData = aiKisiData.map(item => ({ ...item, selected: checked }));
    setAiKisiData(newData);
  };

  const handleDLChange = (index, val) => {
    const newData = [...aiKisiData];
    newData[index].dl = val;
    setAiKisiData(newData);
  };

  const buildSoalPrompt = (selected) => {
    const tpList = selected.map((item, i) => `${i + 1}. [${item.level}][${item.tingkat}][${item.dl}] TP: ${item.tp} | Materi: ${item.materi} | Indikator: ${item.indikator}`).join('\n');
    return `Buat soal pilihan ganda untuk setiap TP berikut (perhatikan Pendekatan DL masing-masing):

${tpList}

Konteks:
- Mapel: ${mapel}, Kelas: ${kelas}

Aturan:
1. Setiap soal WAJIB punya stimulus skenario nyata yang relevan dengan mata pelajaran ${mapel}.
2. PENTING: Untuk ekspresi MATEMATIKA, rumus, atau simbol teknis, WAJIB gunakan format LaTeX dengan pembatas:
   - Gunakan $ ... $ untuk rumus di dalam baris (inline).
   - Gunakan $$ ... $$ untuk rumus yang butuh baris baru sendiri (display).
   - Untuk RUMUS KIMIA, gunakan format \\ce{...} di dalam pembatas tersebut. Contoh: $\\ce{H2O}$ atau $\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$.
3. Pertanyaan sesuai level kognitif yang tercantum.
4. Terapkan Pendekatan DL sesuai yang tertera di setiap TP.
5. 5 pilihan (A-E), pengecoh masuk akal secara teknis.
6. Sertakan HOTs dan pertanyaan refleksi.

Kembalikan HANYA JSON murni tanpa markdown:
[{"tp":"...","materi":"...","indikator":"...","level":"C4","tingkat":"Sedang","dl":"Meaningful Learning","stimulus":"Skenario nyata...","soal":"Pertanyaan...","opsi":[{"huruf":"A","teks":"..."},{"huruf":"B","teks":"..."},{"huruf":"C","teks":"..."},{"huruf":"D","teks":"..."},{"huruf":"E","teks":"..."}],"kunci":"A","hots":"Jenis penalaran","refleksi":"Pertanyaan refleksi"}]`;
  };

  const generateSoal = async () => {
    const selected = aiKisiData.filter(d => d.selected);
    if (!selected.length) { alert('Pilih minimal 1 TP.'); return; }

    setLoadingSoal(true); setErrorSoal(''); setAiSoalData([]);

    const sysPrompt = `Kamu adalah pembuat soal profesional Kurikulum Merdeka SMK Indonesia dengan pendekatan Deep Learning. Buat soal pilihan ganda HOTs dengan stimulus autentik yang relevan dengan ${mapel}. PENTING: Selalu gunakan format LaTeX ($...$ atau $$...$$) untuk semua ekspresi matematika, rumus, atau simbol teknis lainnya. Untuk RUMUS KIMIA, gunakan perintah \\ce{...}. Jawab Bahasa Indonesia. Kembalikan HANYA JSON murni tanpa markdown atau teks di luar JSON.`;
    const userPrompt = buildSoalPrompt(selected);

    try {
      const raw = await callAI(sysPrompt, userPrompt);
      let data = extractJSON(raw);

      const mappedData = data.map((s, i) => {
        const srcDL = selected[i] ? selected[i].dl : (s.dl || 'Meaningful Learning');
        return {
          ...s,
          mapel, kelas, cp, atp,
          dl: s.dl || srcDL,
          konteks: `Konteks nyata ${mapel}`,
          saved: false
        };
      });
      setAiSoalData(mappedData);
    } catch (e) {
      setErrorSoal(e.message);
    } finally {
      setLoadingSoal(false);
    }
  };

  const simpanSoalAI = (i) => {
    const s = aiSoalData[i];
    const opsi = (s.opsi || []).map(o => ({ huruf: o.huruf, teks: o.teks, kunci: o.huruf === s.kunci }));
    const soal = {
      mapel: s.mapel, kelas: s.kelas, cp: s.cp, atp: s.atp, level: s.level, dl: s.dl,
      tp: s.tp, materi: s.materi, indikator: s.indikator, stimulus: s.stimulus,
      soal: s.soal, hots: s.hots || '', konteks: s.konteks || `Konteks ${mapel}`,
      refleksi: s.refleksi || '', opsi, kunci: s.kunci
    };

    saveToDB([...soalDB, soal]);

    const newData = [...aiSoalData];
    newData[i].saved = true;
    setAiSoalData(newData);
    showToast(`Soal ${i + 1} disimpan ke bank soal`);
  };

  const simpanSemuaAI = () => {
    let count = 0;
    const toSave = [];
    const newData = [...aiSoalData];

    aiSoalData.forEach((s, i) => {
      if (!s.saved) {
        const opsi = (s.opsi || []).map(o => ({ huruf: o.huruf, teks: o.teks, kunci: o.huruf === s.kunci }));
        toSave.push({
          mapel: s.mapel, kelas: s.kelas, cp: s.cp, atp: s.atp, level: s.level, dl: s.dl,
          tp: s.tp, materi: s.materi, indikator: s.indikator, stimulus: s.stimulus,
          soal: s.soal, hots: s.hots || '', konteks: s.konteks || `Konteks ${mapel}`,
          refleksi: s.refleksi || '', opsi, kunci: s.kunci
        });
        newData[i].saved = true;
        count++;
      }
    });

    if (count > 0) {
      saveToDB([...soalDB, ...toSave]);
      setAiSoalData(newData);
      showToast(`${count} soal disimpan ke bank soal`);
    } else {
      showToast('Semua soal sudah tersimpan');
    }
  };

  const salinKisiKisi = () => {
    if (!mapel || !cp || !atp) { alert('Lengkapi Mata Pelajaran, Elemen CP, dan Tujuan Pembelajaran (TP) terlebih dahulu.'); return; }
    const prompt = buildKisiPrompt();
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedKisi(true);
      setTimeout(() => setCopiedKisi(false), 2500);
      showToast('Prompt kisi-kisi tersalin! Buka Claude.ai dan paste.');
    }).catch(() => {
      window.prompt('Salin teks berikut secara manual (Ctrl+A, Ctrl+C):', prompt);
    });
  };

  const muatKisiManual = () => {
    if (!pasteKisi.trim()) { alert('Paste jawaban dari AI terlebih dahulu.'); return; }
    try {
      let data = extractJSON(pasteKisi);
      if (data.length > totalTP && totalTP > 0) data = data.slice(0, totalTP);
      const mappedData = data.map(item => ({
        ...item,
        dl: item.tingkat === 'Mudah' ? 'Joyful Learning' : item.tingkat === 'Sedang' ? 'Meaningful Learning' : 'Mindful Learning',
        selected: false
      }));
      setAiKisiData(mappedData);
      setAiSoalData([]);
      showToast(`Kisi-kisi berhasil dimuat (${data.length} TP). Pilih DL per TP lalu centang.`);
    } catch (e) {
      alert(`Gagal membaca data.\nDetail error: ${e.message}`);
    }
  };

  const salinSoal = () => {
    const selected = aiKisiData.filter(d => d.selected);
    if (!selected.length) { alert('Pilih minimal 1 TP dari tabel kisi-kisi.'); return; }
    const prompt = buildSoalPrompt(selected);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopiedSoal(true);
      setTimeout(() => setCopiedSoal(false), 2500);
      showToast('Prompt soal tersalin! Buka Claude.ai dan paste.');
    }).catch(() => {
      window.prompt('Salin teks berikut:', prompt);
    });
  };

  const muatSoalManual = () => {
    if (!pasteSoal.trim()) { alert('Paste jawaban soal dari AI terlebih dahulu.'); return; }
    try {
      let data = extractJSON(pasteSoal);
      const mappedData = data.map((s) => ({
        ...s,
        mapel, kelas, cp, atp,
        dl: s.dl || 'Meaningful Learning',
        konteks: 'Penerapan konsep akademik',
        saved: false
      }));
      setAiSoalData(mappedData);
      showToast(`${mappedData.length} soal berhasil dimuat!`);
    } catch (e) {
      alert(`Gagal membaca data soal.\nDetail error: ${e.message}`);
    }
  };

  const selectedCount = aiKisiData.filter(d => d.selected).length;
  const allSelected = selectedCount === aiKisiData.length && aiKisiData.length > 0;

  return (
    <div className="panel active print-hide">
      <div className="ai-intro">
        <h3>✨ Generate Kisi-Kisi &amp; Soal dengan AI</h3>
        <p>Pilih mode di bawah: gunakan <strong>API Key</strong> jika punya akun Anthropic berbayar, atau pilih <strong>Tanpa API Key (Gratis)</strong> untuk menyalin prompt ke Claude.ai secara manual — 100% gratis.</p>
      </div>

      <div className="mode-toggle">
        <button className={`mode-btn ${mode === 'api' ? 'active' : ''}`} onClick={() => setMode('api')}>🔒 Dengan API Key (Otomatis)</button>
        <button className={`mode-btn ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode('manual')}>🆓 Tanpa API Key (Gratis)</button>
      </div>

      <div className="section-card">
        <h3>📄 Identitas Pembelajaran</h3>
        <div className="form-grid">
          <div className="form-group"><label>Mata Pelajaran</label><input type="text" value={mapel} onChange={e => setMapel(e.target.value)} /></div>
          <div className="form-group"><label>Kelas / Fase</label>
            <select value={kelas} onChange={e => setKelas(e.target.value)}>
              <optgroup label="SD (Sekolah Dasar)">
                <option>I / Fase A</option>
                <option>II / Fase A</option>
                <option>III / Fase B</option>
                <option>IV / Fase B</option>
                <option>V / Fase C</option>
                <option>VI / Fase C</option>
              </optgroup>
              <optgroup label="SMP (Sekolah Menengah Pertama)">
                <option>VII / Fase D</option>
                <option>VIII / Fase D</option>
                <option>IX / Fase D</option>
              </optgroup>
              <optgroup label="SMA / SMK">
                <option>X / Fase E</option>
                <option>XI / Fase F</option>
                <option>XII / Fase F</option>
              </optgroup>
            </select>
          </div>
          <div className="form-group"><label>Elemen Capaian Pembelajaran</label><input type="text" value={cp} onChange={e => setCp(e.target.value)} /></div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Tujuan Pembelajaran (TP) — Bisa satu topik besar atau daftar detail TP</label>
            <textarea 
              value={atp} 
              onChange={e => setAtp(e.target.value)} 
              placeholder="Contoh: &#10;1. Menganalisis rangkaian seri&#10;2. Menghitung tegangan jatuh&#10;...atau ketik satu topik besar saja"
              rows="3"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #AFA9EC', fontFamily: 'inherit', fontSize: '13px' }}
            ></textarea>
          </div>
        </div>

        <div style={{ background: '#F4F3FE', border: '1px solid #AFA9EC', borderRadius: 10, padding: 14, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#3C3489', marginBottom: 10 }}>🎯 Distribusi Tingkat Kesulitan TP</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div style={{ background: '#EAF3DE', border: '1px solid #97C459', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#27500A', marginBottom: 6 }}>🟢 Mudah (C1–C2)</div>
              <input type="number" min="0" max="20" value={distMudah} onChange={e => setDistMudah(parseInt(e.target.value) || 0)} style={{ width: 60, textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#27500A', border: '1.5px solid #97C459', borderRadius: 6, padding: 4, background: '#fff' }} />
              <div style={{ fontSize: 10, color: '#3B6D11', marginTop: 4 }}>TP</div>
            </div>
            <div style={{ background: '#FAEEDA', border: '1px solid #E8A838', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#633806', marginBottom: 6 }}>🟡 Sedang (C3–C4)</div>
              <input type="number" min="0" max="20" value={distSedang} onChange={e => setDistSedang(parseInt(e.target.value) || 0)} style={{ width: 60, textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#633806', border: '1.5px solid #E8A838', borderRadius: 6, padding: 4, background: '#fff' }} />
              <div style={{ fontSize: 10, color: '#854F0B', marginTop: 4 }}>TP</div>
            </div>
            <div style={{ background: '#FCEBEB', border: '1px solid #F09595', borderRadius: 8, padding: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#791F1F', marginBottom: 6 }}>🔴 Mahir (C5–C6)</div>
              <input type="number" min="0" max="20" value={distMahir} onChange={e => setDistMahir(parseInt(e.target.value) || 0)} style={{ width: 60, textAlign: 'center', fontSize: 18, fontWeight: 700, color: '#791F1F', border: '1.5px solid #F09595', borderRadius: 6, padding: 4, background: '#fff' }} />
              <div style={{ fontSize: 10, color: '#A32D2D', marginTop: 4 }}>TP</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 700 }}>Total: <span style={{ fontSize: 16, color: '#3C3489' }}>{totalTP}</span> TP</div>
            <div style={{ fontSize: 11, color: '#888' }}>— Pendekatan Deep Learning dapat dipilih per TP di tabel kisi-kisi setelah di-generate</div>
          </div>
        </div>
      </div>

      {mode === 'api' && (
        <div className="mode-panel active">
          <div className="section-card">
            <h3>🤖 Pilih Provider AI</h3>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              <button className={`mode-btn ${provider === 'gemini' ? 'active' : ''}`} onClick={() => { setProvider('gemini'); setApiKey(''); }} style={{ flex: 1, borderRadius: 8, fontSize: 11 }}>Google Gemini</button>
              <button className={`mode-btn ${provider === 'claude' ? 'active' : ''}`} onClick={() => { setProvider('claude'); setApiKey(''); }} style={{ flex: 1, borderRadius: 8, fontSize: 11 }}>Anthropic Claude</button>
              <button className={`mode-btn ${provider === 'chatgpt' ? 'active' : ''}`} onClick={() => { setProvider('chatgpt'); setApiKey(''); }} style={{ flex: 1, borderRadius: 8, fontSize: 11 }}>ChatGPT (OpenAI)</button>
            </div>
            <h3>🔒 API Key {provider === 'gemini' ? 'Gemini' : provider === 'claude' ? 'Claude' : 'ChatGPT'}</h3>
            <p style={{ fontSize: 11, color: '#666', marginBottom: 10 }}>
              {provider === 'chatgpt' 
                ? 'Masukkan API key dari OpenAI (sk-...). Pastikan akun Anda memiliki saldo (credit).' 
                : `Masukkan API key ${provider === 'gemini' ? 'Gemini' : 'Anthropic'} Anda.`}
            </p>
            <div className="api-key-row">
              <input type={showKey ? 'text' : 'password'} placeholder={provider === 'chatgpt' ? 'sk-proj-...' : 'sk-...'} value={apiKey} onChange={e => setApiKey(e.target.value)} autoComplete="off" />
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 12, whiteSpace: 'nowrap' }} onClick={() => setShowKey(!showKey)}>Tampilkan</button>
            </div>
          </div>
          <div className="row" style={{ marginBottom: 14 }}>
            <button className="btn-ai" onClick={generateKisiKisi} disabled={loadingKisi}>✨ Generate Kisi-Kisi</button>
            <span style={{ fontSize: 11, color: '#888' }}>AI akan menyusun TP dari Mudah ke Mahir secara otomatis</span>
          </div>

          {loadingKisi && (
            <div className="loading-box show">
              <div className="spinner"></div>
              <p>Menyusun kisi-kisi soal...</p>
              <small>AI sedang merancang tujuan pembelajaran dari mudah ke mahir</small>
            </div>
          )}
          {errorKisi && <div className="error-box show">Error: {errorKisi}</div>}
        </div>
      )}

      {mode === 'manual' && (
        <div className="mode-panel active">
          <div className="manual-steps">
            <div className="manual-step">
              <div className="step-num">1</div>
              <div className="step-body" style={{ flex: 1 }}>
                <h4>Salin prompt kisi-kisi → buka Claude.ai → paste → kirim</h4>
                <p>Klik tombol <strong>Salin Prompt Kisi-Kisi</strong>, lalu buka Claude.ai di tab baru, paste prompt, dan kirim. Salin seluruh jawaban JSON dari Claude.</p>
                <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <button className={`btn-copy ${copiedKisi ? 'copied' : ''}`} onClick={salinKisiKisi}>
                    {copiedKisi ? '✓ Tersalin!' : '📋 Salin Prompt Kisi-Kisi'}
                  </button>
                  <a className="claude-link" href="https://claude.ai" target="_blank" rel="noreferrer">🔗 Buka Claude.ai</a>
                </div>
              </div>
            </div>
            <div className="manual-step">
              <div className="step-num">2</div>
              <div className="step-body" style={{ flex: 1 }}>
                <h4>Paste jawaban JSON kisi-kisi dari Claude di sini</h4>
                <p>Salin seluruh teks JSON yang diberikan Claude (mulai dari <code>[</code> sampai <code>]</code>), lalu paste di kotak ini dan klik <strong>Muat Kisi-Kisi</strong>.</p>
                <div className="paste-area-wrap">
                  <textarea placeholder='Paste JSON dari Claude di sini...' value={pasteKisi} onChange={e => setPasteKisi(e.target.value)}></textarea>
                </div>
                <button className="btn-parse" onClick={muatKisiManual}>⤵️ Muat Kisi-Kisi</button>
              </div>
            </div>

            <div className="manual-step" style={{ opacity: aiKisiData.length ? 1 : 0.4, pointerEvents: aiKisiData.length ? 'auto' : 'none' }}>
              <div className="step-num">3</div>
              <div className="step-body" style={{ flex: 1 }}>
                <h4>Pilih TP di tabel kisi-kisi di bawah, lalu salin prompt soal</h4>
                <p>Setelah memilih TP yang diinginkan dari tabel kisi-kisi, klik <strong>Salin Prompt Soal</strong>, buka Claude.ai, paste, dan kirim.</p>
                <button className={`btn-copy ${copiedSoal ? 'copied' : ''}`} onClick={salinSoal} style={{ marginTop: 8 }}>
                  {copiedSoal ? '✓ Tersalin!' : '⚡ Salin Prompt Soal dari TP Terpilih'}
                </button>
                <a className="claude-link" href="https://claude.ai" target="_blank" rel="noreferrer" style={{ marginTop: 8 }}>🔗 Buka Claude.ai</a>
              </div>
            </div>

            <div className="manual-step" style={{ opacity: aiKisiData.length ? 1 : 0.4, pointerEvents: aiKisiData.length ? 'auto' : 'none' }}>
              <div className="step-num">4</div>
              <div className="step-body" style={{ flex: 1 }}>
                <h4>Paste jawaban JSON soal dari Claude di sini</h4>
                <p>Salin seluruh JSON soal dari Claude, paste di kotak ini, lalu klik <strong>Muat &amp; Tampilkan Soal</strong>.</p>
                <div className="paste-area-wrap">
                  <textarea placeholder='Paste JSON soal dari Claude di sini...' value={pasteSoal} onChange={e => setPasteSoal(e.target.value)}></textarea>
                </div>
                <button className="btn-parse" onClick={muatSoalManual}>⤵️ Muat &amp; Tampilkan Soal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {aiKisiData.length > 0 && (
        <div className="ai-kisi-result show">
          <div className="section-card">
            <h3>📋 Kisi-Kisi — Pilih TP untuk Dibuat Soal</h3>
            <div className="ai-kisi-info">{mapel} | {kelas} | {cp} | {aiKisiData.length} TP — pilih DL per baris</div>
            <div className="select-all-row">
              <input type="checkbox" id="cb-all" style={{ width: 16, height: 16, accentColor: '#1D9E75', cursor: 'pointer' }} checked={allSelected} onChange={handleKisiSelectAll} />
              <label htmlFor="cb-all" style={{ cursor: 'pointer' }}>Pilih Semua TP</label>
              <span className="selected-count">{selectedCount} TP dipilih</span>
            </div>
            <div className="ai-kisi-table-wrap">
              <table className="ai-kisi-table">
                <thead>
                  <tr>
                    <th style={{ width: 38, textAlign: 'center' }}>Pilih</th>
                    <th style={{ width: 32, textAlign: 'center' }}>No</th>
                    <th style={{ width: '21%' }}>Tujuan Pembelajaran</th>
                    <th style={{ width: '14%' }}>Materi Pokok</th>
                    <th style={{ width: '22%' }}>Indikator Soal</th>
                    <th style={{ width: '7%', textAlign: 'center' }}>Level</th>
                    <th style={{ width: '8%', textAlign: 'center' }}>Tingkat</th>
                    <th style={{ width: '14%' }}>Pendekatan DL</th>
                  </tr>
                </thead>
                <tbody>
                  {aiKisiData.map((item, i) => {
                    const tc = item.tingkat === 'Mudah' ? 'tp-mudah' : item.tingkat === 'Sedang' ? 'tp-sedang' : 'tp-mahir';
                    return (
                      <tr key={i} onClick={() => handleKisiSelect(i)}>
                        <td style={{ textAlign: 'center' }}><input type="checkbox" className="row-check" checked={item.selected} onChange={() => { }} onClick={e => e.stopPropagation()} /></td>
                        <td className="td-no">{item.no}</td>
                        <td>{item.tp}</td>
                        <td>{item.materi}</td>
                        <td>{item.indikator}</td>
                        <td className="td-center"><span className="level-badge">{LEVEL_LABELS[item.level] || item.level}</span></td>
                        <td className="td-center"><span className={tc}>{item.tingkat}</span></td>
                        <td onClick={e => e.stopPropagation()}>
                          <select style={{ fontSize: 11, padding: '4px 6px', border: '1px solid #AFA9EC', borderRadius: 6, background: '#F4F3FE', color: '#534AB7', width: '100%', cursor: 'pointer' }} value={item.dl} onChange={e => handleDLChange(i, e.target.value)}>
                            <option value="Mindful Learning">Mindful</option>
                            <option value="Meaningful Learning">Meaningful</option>
                            <option value="Joyful Learning">Joyful</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {mode === 'api' && (
              <div className="gen-soal-row">
                <button className="btn-success" onClick={generateSoal} disabled={selectedCount === 0 || loadingSoal}>⚡ Generate Soal dari TP Terpilih</button>
                <span style={{ fontSize: 11, color: '#666' }}>Pilih minimal 1 TP terlebih dahulu</span>
              </div>
            )}
          </div>

          {loadingSoal && (
            <div className="loading-box show">
              <div className="spinner"></div>
              <p>Membuat soal pilihan ganda...</p>
              <small>AI sedang menyusun soal dengan stimulus autentik berbasis Deep Learning</small>
            </div>
          )}
          {errorSoal && <div className="error-box show">Error: {errorSoal}</div>}

          {aiSoalData.length > 0 && (
            <div className="ai-soal-result show">
              <div className="section-card">
                <h3>✅ Soal Hasil Generate AI</h3>
                <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Simpan soal yang diinginkan ke bank soal, atau simpan semua sekaligus.</p>
                <div className="row" style={{ marginBottom: 14 }}>
                  <button className="btn-primary" onClick={simpanSemuaAI}>✓ Simpan Semua ke Bank Soal</button>
                </div>

                <div>
                  {aiSoalData.map((s, i) => {
                    const tc = s.tingkat === 'Mudah' ? 'tp-mudah' : s.tingkat === 'Sedang' ? 'tp-sedang' : 'tp-mahir';
                    return (
                      <div className="ai-soal-card" key={i}>
                        <div className="row" style={{ marginBottom: 10 }}>
                          <div className="ai-soal-num">{i + 1}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <span className="level-badge">{LEVEL_LABELS[s.level] || s.level}</span>
                            <span className={tc}>{s.tingkat}</span>
                            <span className="pill pill-amber">{(s.materi || '').substring(0, 28)}</span>
                            <span className="pill pill-purple">{s.dl}</span>
                          </div>
                        </div>
                        {s.stimulus && (
                          <div className="ai-soal-stimulus">
                            <MathText text={s.stimulus} />
                          </div>
                        )}
                        <div className="ai-soal-q">
                          <MathText text={s.soal} />
                        </div>
                        <div className="ai-soal-opsi">
                          {(s.opsi || []).map((o, j) => (
                            <div key={j} className={`ai-opsi-item ${o.huruf === s.kunci ? 'k' : ''}`}>
                              <span style={{ minWidth: 16, fontWeight: 700 }}>{o.huruf}.</span>
                              <MathText text={o.teks} style={{ display: 'inline' }} />
                            </div>
                          ))}
                        </div>
                        <div style={{ fontSize: 11, color: '#534AB7', marginBottom: 10, lineHeight: 1.5 }}>
                          {s.hots && <span><strong>HOTs:</strong> {s.hots}&nbsp;</span>}
                          {s.refleksi && <span><br /><strong>Refleksi:</strong> {s.refleksi}</span>}
                        </div>
                        <button className={`ai-simpan-btn ${s.saved ? 'done' : ''}`} onClick={() => !s.saved && simpanSoalAI(i)} disabled={s.saved}>
                          {s.saved ? '✓ Tersimpan!' : '✓ Simpan ke Bank Soal'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TabAI;
