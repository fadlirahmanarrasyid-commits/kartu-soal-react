import { useState, useEffect } from 'react';
import './index.css';

import TabAI from './components/TabAI';
import TabBuat from './components/TabBuat';
import TabDaftar from './components/TabDaftar';
import TabKisi from './components/TabKisi';
import TabPreview from './components/TabPreview';
import TabDeepLearning from './components/TabDeepLearning';
import TabSettings from './components/TabSettings';
import TabAbout from './components/TabAbout';

const STORAGE_KEY = 'kartu_soal_db_v2';
const SETTINGS_KEY = 'kartu_soal_settings';
const DB_NAME = 'KartuSoalIndexedDB';
const STORE_NAME = 'soalStore';

const DEFAULT_SETTINGS = {
  namaAsesmen: 'Asesmen Sumatif Akhir Semester',
  namaSekolah: 'SMK Nusantara',
  tahunPelajaran: '2024/2025',
  namaPenyusun: '-',
  nipPenyusun: '-',
  namaKepalaSekolah: '-',
  nipKepalaSekolah: '-',
  logoSekolah: null
};

// --- INDEXED DB HELPERS ---
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

const getIDBData = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('all_soal');
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

const saveIDBData = async (data) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, 'all_soal');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
// --------------------------

function App() {
  const [soalDB, setSoalDB] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState('ai');
  const [editIdx, setEditIdx] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const loadAll = async () => {
      try {
        // Load Settings from LocalStorage (small data is fine here)
        const s = localStorage.getItem(SETTINGS_KEY);
        if (s) setSettings(JSON.parse(s));

        // Load Soal from IndexedDB
        let data = await getIDBData();

        // MIGRATION: If IDB is empty, check if there's old data in LocalStorage
        if (data.length === 0) {
          const oldData = localStorage.getItem(STORAGE_KEY);
          if (oldData) {
            const parsed = JSON.parse(oldData);
            if (parsed && parsed.length > 0) {
              console.log('Migrating data to IndexedDB...');
              await saveIDBData(parsed);
              data = parsed;
              // Optional: Clear old storage after successful migration
              // localStorage.removeItem(STORAGE_KEY); 
            }
          }
        }
        setSoalDB(data);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadAll();
  }, []);

  const saveToDB = async (newDB) => {
    setSoalDB(newDB);
    try {
      await saveIDBData(newDB);
    } catch (e) {
      console.error('Failed to save to IndexedDB', e);
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const resetSemua = () => {
    if (!window.confirm('Reset semua data soal?')) return;
    saveToDB([]);
    setEditIdx(null);
    setActiveTab('buat');
  };

  const cetakSemua = () => {
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const eksporJSON = () => {
    if (!soalDB.length) {
      alert('Belum ada soal.');
      return;
    }
    const blob = new Blob([JSON.stringify({ versi: '2.0', tanggal: new Date().toISOString(), soal: soalDB }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kartu_soal_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const imporJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const soals = data.soal || data;
        if (!Array.isArray(soals)) throw new Error();
        if (window.confirm(`Impor ${soals.length} soal? Akan digabungkan dengan data yang ada.`)) {
          saveToDB([...soalDB, ...soals]);
          showToast(`${soals.length} soal diimpor`);
          setActiveTab('daftar');
        }
      } catch (err) {
        alert('File tidak valid.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <h1>
            📚 Aplikasi Kartu Soal — Kurikulum Merdeka
            <span style={{ 
              fontSize: '11px', 
              background: '#E8A838', 
              color: '#fff', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              marginLeft: '10px',
              verticalAlign: 'middle',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>v1.7.0</span>
          </h1>
          <p>SMK · Deep Learning · AI Powered · Offline Ready</p>
        </div>
        <div className="topbar-right">
          {showInstallBtn && (
            <button 
              className="btn-top" 
              style={{ background: '#1D9E75', borderColor: '#A2E2C8', color: '#fff' }} 
              onClick={handleInstallClick}
            >
              📲 Pasang Aplikasi
            </button>
          )}
          <button className="btn-top" onClick={eksporJSON}>⬇️ Ekspor</button>
          <button className="btn-top" onClick={() => document.getElementById('impor-file').click()}>⬆️ Impor</button>
          <input type="file" id="impor-file" accept=".json" style={{ display: 'none' }} onChange={imporJSON} />
          <button className="btn-top" onClick={() => setActiveTab('about')}>ℹ️ About</button>
          <button className="btn-top" style={{ background: '#A32D2D', borderColor: '#F09595' }} onClick={resetSemua}>Reset</button>
        </div>
      </div>

      <div className="tabs print-hide">
        <div className={`tab ai-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>✨ Generate AI</div>
        <div className={`tab ${activeTab === 'buat' ? 'active' : ''}`} onClick={() => setActiveTab('buat')}>+ Buat Soal</div>
        <div className={`tab ${activeTab === 'daftar' ? 'active' : ''}`} onClick={() => setActiveTab('daftar')}>📄 Daftar Soal</div>
        <div className={`tab ${activeTab === 'kisikisi' ? 'active' : ''}`} onClick={() => setActiveTab('kisikisi')}>📋 Kisi-Kisi</div>
        <div className={`tab ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>👁️ Pratinjau Kartu</div>
        <div className={`tab ${activeTab === 'deeplearning' ? 'active' : ''}`} onClick={() => setActiveTab('deeplearning')}>🎓 Deep Learning</div>
        <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Pengaturan</div>
      </div>

      {activeTab === 'ai' && <TabAI soalDB={soalDB} saveToDB={saveToDB} showToast={showToast} />}
      {activeTab === 'buat' && <TabBuat soalDB={soalDB} saveToDB={saveToDB} editIdx={editIdx} setEditIdx={setEditIdx} setActiveTab={setActiveTab} showToast={showToast} />}
      {activeTab === 'daftar' && <TabDaftar soalDB={soalDB} saveToDB={saveToDB} setEditIdx={setEditIdx} setActiveTab={setActiveTab} onPrint={cetakSemua} />}
      {activeTab === 'kisikisi' && <TabKisi soalDB={soalDB} settings={settings} />}
      {activeTab === 'preview' && <TabPreview soalDB={soalDB} settings={settings} />}
      {activeTab === 'deeplearning' && <TabDeepLearning soalDB={soalDB} />}
      {activeTab === 'settings' && <TabSettings settings={settings} setSettings={saveSettings} showToast={showToast} />}
      {activeTab === 'about' && <TabAbout />}

      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, background: '#27500A', color: '#EAF3DE',
          padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, zIndex: 9999,
          maxWidth: 300, wordBreak: 'break-word',
          opacity: 1, transition: 'opacity 0.3s'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}

export default App;
