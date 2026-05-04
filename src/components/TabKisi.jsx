import XLSX from 'xlsx-js-style';
import { saveAs } from 'file-saver';

function TabKisi({ soalDB, settings }) {
  if (soalDB.length === 0) {
    return (
      <div className="panel active">
        <div className="kisi-header-box print-hide">
          <div className="row" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0C447C', margin: 0 }}>Kisi-Kisi Soal</h3>
          </div>
          <div className="kisi-header-grid" id="kisi-identitas">
            <div className="kisi-header-row"><span className="k">Belum ada data soal</span></div>
          </div>
        </div>
        <div className="empty">Belum ada soal. Gunakan Generate AI atau Buat Soal manual.</div>
      </div>
    );
  }

  const s0 = soalDB[0];
  const lot = soalDB.filter((s) => ['C1', 'C2'].includes(s.level)).length;
  const mot = soalDB.filter((s) => ['C3', 'C4'].includes(s.level)).length;
  const hot = soalDB.filter((s) => ['C5', 'C6'].includes(s.level)).length;

  const cetakKisiKisi = () => {
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const exportToExcel = () => {
    const titleStyle = {
      font: { bold: true, size: 14, color: { rgb: "0C447C" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    const identityStyle = {
      font: { bold: true },
      alignment: { vertical: "center" }
    };

    const headerStyle = {
      fill: { fgColor: { rgb: "0C447C" } },
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    const cellStyle = {
      alignment: { vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Prepare Data
    const data = [
      ["KISI-KISI PENULISAN SOAL"],
      [settings.namaAsesmen],
      [""],
      ["Nama Sekolah", `: ${settings.namaSekolah}`],
      ["Tahun Pelajaran", `: ${settings.tahunPelajaran}`],
      ["Mata Pelajaran", `: ${s0.mapel || '-'}`],
      ["Kelas / Fase", `: ${s0.kelas || '-'}`],
      ["Jumlah Soal", `: ${soalDB.length} butir`],
      ["Penyusun", `: ${settings.namaPenyusun}`],
      [""],
      ["No", "Tujuan Pembelajaran", "Materi Pokok", "Indikator Soal", "Level Kognitif", "Bentuk Soal", "No Soal", "Kunci"]
    ];

    soalDB.forEach((s, i) => {
      data.push([
        i + 1,
        s.tp || '-',
        s.materi || '-',
        s.indikator || '-',
        s.level,
        'Pilihan Ganda',
        i + 1,
        s.kunci
      ]);
    });

    data.push([""]);
    data.push([""]);
    data.push(["Mengetahui,", "", "", "", "", "", "Penyusun,"]);
    data.push(["Kepala Sekolah", "", "", "", "", "", ""]);
    data.push([""]);
    data.push([""]);
    data.push([settings.namaKepalaSekolah, "", "", "", "", "", settings.namaPenyusun]);
    data.push([`NIP. ${settings.nipKepalaSekolah}`, "", "", "", "", "", `NIP. ${settings.nipPenyusun}`]);

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Merges
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }
    ];

    // Styling
    const range = XLSX.utils.decode_range(ws['!ref']);
    const sigStart = range.e.r - 5;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const ref = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[ref]) continue;

        if (R === 0 || R === 1) {
          ws[ref].s = titleStyle;
        } else if (R >= 3 && R <= 8) {
          if (C === 0) ws[ref].s = identityStyle;
        } else if (R === 10) {
          ws[ref].s = headerStyle;
        } else if (R >= 11 && R < sigStart - 1) {
          ws[ref].s = cellStyle;
          if ([0, 4, 5, 6, 7].includes(C)) {
            ws[ref].s = { ...cellStyle, alignment: { horizontal: "center", vertical: "center" } };
          }
        } else if (R >= sigStart) {
          ws[ref].s = { 
            font: { bold: (R === range.e.r - 1), underline: (R === range.e.r - 1) },
            alignment: { horizontal: "center" } 
          };
        }
      }
    }

    ws['!cols'] = [
      { wch: 5 }, { wch: 35 }, { wch: 20 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 8 }, { wch: 8 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kisi-Kisi Soal");
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Kisi-Kisi_${settings.namaAsesmen}_${settings.namaSekolah}.xlsx`);
  };

  const exportToWord = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; }
          table { border-collapse: collapse; width: 100%; border: 1px solid #0C447C; }
          th { background-color: #0C447C; color: white; border: 1px solid #0C447C; padding: 8px; font-size: 11px; }
          td { border: 1px solid #0C447C; padding: 6px; font-size: 10px; vertical-align: top; }
          .td-no, .td-center, .td-kunci { text-align: center; }
          .header-box { text-align: center; margin-bottom: 20px; border-bottom: 3px double #0C447C; padding-bottom: 10px; }
          .identity { margin-bottom: 20px; font-size: 11px; }
          .level-badge { background: #eef4ff; color: #0C447C; font-weight: bold; border: 1px solid #0C447C; border-radius: 4px; padding: 2px 4px; }
          .footer { margin-top: 30px; display: table; width: 100%; font-size: 11px; }
          .footer-col { display: table-cell; width: 50%; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-box">
          <h2 style="color: #0C447C; margin: 0;">KISI-KISI PENULISAN SOAL</h2>
          <h3 style="margin: 5px 0;">${settings.namaAsesmen}</h3>
        </div>
        <div class="identity">
          <table>
            <tr><td style="border:none; width: 150px;">Nama Sekolah</td><td style="border:none;">: ${settings.namaSekolah}</td></tr>
            <tr><td style="border:none;">Tahun Pelajaran</td><td style="border:none;">: ${settings.tahunPelajaran}</td></tr>
            <tr><td style="border:none;">Mata Pelajaran</td><td style="border:none;">: ${s0.mapel || '-'}</td></tr>
            <tr><td style="border:none;">Kelas / Fase</td><td style="border:none;">: ${s0.kelas || '-'}</td></tr>
          </table>
        </div>
    `;

    const tableContent = document.querySelector('.kisi-table').outerHTML;

    const footer = `
        <div class="footer">
          <div class="footer-col">
            <p>Mengetahui,</p>
            <p>Kepala Sekolah</p>
            <br><br><br>
            <p><b><u>${settings.namaKepalaSekolah}</u></b></p>
            <p>NIP. ${settings.nipKepalaSekolah}</p>
          </div>
          <div class="footer-col">
            <p>&nbsp;</p>
            <p>Penyusun,</p>
            <br><br><br>
            <p><b><u>${settings.namaPenyusun}</u></b></p>
            <p>NIP. ${settings.nipPenyusun}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const fullHtml = header + tableContent + footer;
    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    saveAs(blob, `Kisi-Kisi_${settings.namaAsesmen}_${settings.namaSekolah}.doc`);
  };

  return (
    <div className="panel active">
      <div className="kisi-header-box" style={{ paddingBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: '16px',
          borderBottom: '3px double #0C447C',
          marginBottom: '20px'
        }}>
          {settings.logoSekolah && (
            <img src={settings.logoSekolah} alt="Logo" style={{ height: '65px', width: 'auto', marginRight: '20px' }} />
          )}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, textTransform: 'uppercase', color: '#0C447C' }}>KISI-KISI PENULISAN SOAL</h1>
            <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 0 0' }}>{settings.namaAsesmen}</h2>
          </div>
          <div style={{ width: settings.logoSekolah ? '65px' : '0' }}></div>
        </div>

        <div className="row print-hide" style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0C447C', margin: 0 }}>Detail Identitas</h3>
          <div className="spacer"></div>
          <div style={{ display: 'flex', gap: '8px' }} className="print-hide">
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12, backgroundColor: '#1D6F42', borderColor: '#1D6F42' }} onClick={exportToExcel}>📊 Xlsx</button>
            <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12, backgroundColor: '#2B579A', borderColor: '#2B579A' }} onClick={exportToWord}>📝 Docx</button>
            <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={cetakKisiKisi}>🖨️ Cetak</button>
          </div>
        </div>

        <div className="kisi-header-grid">
          <div className="kisi-header-row"><span className="k">Nama Sekolah</span><span className="v">{settings.namaSekolah}</span></div>
          <div className="kisi-header-row"><span className="k">Tahun Pelajaran</span><span className="v">{settings.tahunPelajaran}</span></div>
          <div className="kisi-header-row"><span className="k">Mata Pelajaran</span><span className="v">{s0.mapel || '-'}</span></div>
          <div className="kisi-header-row"><span className="k">Kelas / Fase</span><span className="v">{s0.kelas || '-'}</span></div>
          <div className="kisi-header-row"><span className="k">Jumlah Soal</span><span className="v">{soalDB.length} butir</span></div>
          <div className="kisi-header-row"><span className="k">Penyusun</span><span className="v">{settings.namaPenyusun}</span></div>
        </div>
      </div>

      <div className="kisi-summary print-hide">
        <div className="kisi-sum-item">Total: <strong>{soalDB.length}</strong></div>
        <div className="kisi-sum-item">LOTs C1–C2: <strong>{lot}</strong></div>
        <div className="kisi-sum-item">MOTs C3–C4: <strong>{mot}</strong></div>
        <div className="kisi-sum-item">HOTs C5–C6: <strong>{hot}</strong></div>
      </div>

      <div className="kisi-wrap">
        <table className="kisi-table">
          <thead>
            <tr>
              <th style={{ width: 36 }}>No</th>
              <th style={{ width: '22%' }}>Tujuan Pembelajaran</th>
              <th style={{ width: '16%' }}>Materi Pokok</th>
              <th style={{ width: '26%' }}>Indikator Soal</th>
              <th style={{ width: '9%' }}>Level Kognitif</th>
              <th style={{ width: '10%' }}>Bentuk Soal</th>
              <th style={{ width: '6%' }}>No Soal</th>
              <th style={{ width: '6%' }}>Kunci</th>
            </tr>
          </thead>
          <tbody>
            {soalDB.map((s, i) => (
              <tr key={i}>
                <td className="td-no">{i + 1}</td>
                <td>{s.tp || '-'}</td>
                <td>{s.materi || '-'}</td>
                <td>{s.indikator || '-'}</td>
                <td className="td-center"><span className="level-badge">{s.level}</span></td>
                <td className="td-center">Pilihan Ganda</td>
                <td className="td-center" style={{ fontWeight: 700, color: '#0C447C' }}>{i + 1}</td>
                <td className="td-kunci">{s.kunci}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '30px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        <div>
          <p>Mengetahui,</p>
          <p style={{ marginBottom: '60px' }}>Kepala Sekolah</p>
          <p style={{ fontWeight: 700, textDecoration: 'underline' }}>{settings.namaKepalaSekolah}</p>
          <p>NIP. {settings.nipKepalaSekolah}</p>
        </div>
        <div>
          <p>&nbsp;</p>
          <p style={{ marginBottom: '60px' }}>Penyusun,</p>
          <p style={{ fontWeight: 700, textDecoration: 'underline' }}>{settings.namaPenyusun}</p>
          <p>NIP. {settings.nipPenyusun}</p>
        </div>
      </div>
    </div>
  );
}

export default TabKisi;
