import { useState } from 'react';

function TabDaftar({ soalDB, saveToDB, setEditIdx, setActiveTab, onPrint }) {
  const [filterLevel, setFilterLevel] = useState('');

  const dlColor = {
    'Mindful Learning': 'pill-purple',
    'Meaningful Learning': 'pill-teal',
    'Joyful Learning': 'pill-amber'
  };

  const hapusSoal = (idx) => {
    if (!window.confirm('Hapus soal ini?')) return;
    const newDB = [...soalDB];
    newDB.splice(idx, 1);
    saveToDB(newDB);
  };

  const editSoal = (idx) => {
    setEditIdx(idx);
    setActiveTab('buat');
  };

  const data = filterLevel ? soalDB.filter(s => s.level === filterLevel) : soalDB;

  const eksporExcel = () => {
    if (soalDB.length === 0) return alert('Tidak ada data soal untuk diekspor.');

    const headers = ['No Urut', 'Soal', 'Jenis Soal', 'Opsi A', 'Opsi B', 'Opsi C', 'Opsi D', 'Opsi E', 'Kunci Jawaban'];

    // Create formal HTML table for Excel
    // Added CSS for wrap text and same-cell break
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Bank Soal</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          .text-wrap {
            mso-number-format: "\\@";
            white-space: normal;
            vertical-align: top;
          }
          br {
            mso-data-placement: same-cell;
          }
        </style>
      </head>
      <body>
        <table border="1">
          <thead>
            <tr style="background-color: #0C447C; color: #ffffff; font-weight: bold;">
              ${headers.map(h => `<th style="padding: 8px;">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    soalDB.forEach((s, i) => {
      const opsiA = s.opsi.find(o => o.huruf === 'A')?.teks || '';
      const opsiB = s.opsi.find(o => o.huruf === 'B')?.teks || '';
      const opsiC = s.opsi.find(o => o.huruf === 'C')?.teks || '';
      const opsiD = s.opsi.find(o => o.huruf === 'D')?.teks || '';
      const opsiE = s.opsi.find(o => o.huruf === 'E')?.teks || '';

      // Combine with special break style for "ALT+ENTER" effect in Excel
      const stimulusPart = s.stimulus ? s.stimulus + '<br style="mso-data-placement:same-cell;" /><br style="mso-data-placement:same-cell;" />' : '';
      const content = `${stimulusPart}${s.soal}`;

      html += `
        <tr>
          <td style="text-align: center; vertical-align: top;">${i + 1}</td>
          <td class="text-wrap">${content}</td>
          <td style="vertical-align: top;">Pilihan Ganda</td>
          <td style="vertical-align: top;">${opsiA}</td>
          <td style="vertical-align: top;">${opsiB}</td>
          <td style="vertical-align: top;">${opsiC}</td>
          <td style="vertical-align: top;">${opsiD}</td>
          <td style="vertical-align: top;">${opsiE}</td>
          <td style="text-align: center; font-weight: bold; vertical-align: top;">${s.kunci}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bank_soal_export_${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel active print-hide">
      <div className="row" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: '#666' }}>Bank soal tersimpan ({soalDB.length})</span>
        <div className="spacer"></div>
        <button
          className="btn-success"
          style={{ padding: '6px 12px', fontSize: 11, marginRight: 8 }}
          onClick={eksporExcel}
        >
          📗 Ekspor ke Excel
        </button>
        <button
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: 11, marginRight: 8, background: '#fff', color: '#1a1a1a' }}
          onClick={onPrint}
        >
          🖨️ Cetak Kartu Soal
        </button>
        <select
          style={{ fontSize: 12, padding: '6px 10px', border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
        >
          <option value="">Semua Level</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
          <option value="C3">C3</option>
          <option value="C4">C4</option>
          <option value="C5">C5</option>
          <option value="C6">C6</option>
        </select>
      </div>

      <div className="soal-list">
        {data.length === 0 ? (
          <div className="empty">Belum ada soal tersimpan.</div>
        ) : (
          data.map((s, idx) => {
            const realIdx = filterLevel ? soalDB.indexOf(s) : idx;
            return (
              <div className="soal-item" key={realIdx}>
                <div className="soal-item-header">
                  <div className="soal-num-badge">{realIdx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div className="soal-item-meta">
                      <span className="pill pill-blue">{s.level}</span>
                      <span className={`pill ${dlColor[s.dl] || 'pill-purple'}`}>{s.dl}</span>
                      <span className="pill pill-amber">{(s.materi || '').substring(0, 28)}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#666' }}>
                      {(s.tp || '').substring(0, 80)}{(s.tp && s.tp.length > 80 ? '...' : '')}
                    </div>
                  </div>
                </div>

                {s.stimulus && (
                  <div style={{ fontSize: 11, color: '#666', background: '#f9f9f9', padding: '6px 8px', borderRadius: 8, marginBottom: 8, fontStyle: 'italic' }}>
                    {s.stimulus.substring(0, 110)}...
                  </div>
                )}
                <div className="soal-q">{s.soal}</div>
                <div className="soal-opsi-mini">
                  {s.opsi.map((o, i) => (
                    <span key={i} className={o.kunci ? 'k' : ''}>
                      {o.huruf}. {o.teks.substring(0, 45)}{o.teks.length > 45 ? '...' : ''} {i < s.opsi.length - 1 ? ' | ' : ''}
                    </span>
                  ))}
                </div>
                <div className="soal-action">
                  <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: 11 }} onClick={() => editSoal(realIdx)}>Edit</button>
                  <button className="btn-danger" onClick={() => hapusSoal(realIdx)}>Hapus</button>
                  <div className="spacer"></div>
                  <span style={{ fontSize: 11, color: '#555' }}>Kunci: <strong>{s.kunci}</strong></span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TabDaftar;
