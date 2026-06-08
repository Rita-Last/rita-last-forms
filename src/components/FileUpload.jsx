import { useRef, useState } from 'react';

function measureSharpness(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Use a max 200x200 sample for performance
      const scale = Math.min(1, 200 / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Convert to grayscale and compute Laplacian variance
      const gray = [];
      for (let i = 0; i < data.length; i += 4) {
        gray.push(0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
      }

      const w = canvas.width;
      const h = canvas.height;
      let sum = 0, sumSq = 0, count = 0;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const lap = Math.abs(
            -gray[(y-1)*w+x] - gray[(y+1)*w+x] -
            gray[y*w+(x-1)] - gray[y*w+(x+1)] +
            4 * gray[y*w+x]
          );
          sum += lap;
          sumSq += lap * lap;
          count++;
        }
      }

      const mean = sum / count;
      const variance = (sumSq / count) - (mean * mean);
      // Threshold: variance < 50 = likely blurry
      resolve(variance);
    };
    img.src = dataUrl;
  });
}

export default function FileUpload({ label, value, onChange, t }) {
  const inputRef = useRef();
  const [sharpnessWarning, setSharpnessWarning] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setSharpnessWarning(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange({ name: file.name, dataUrl });
        measureSharpness(dataUrl).then(variance => {
          if (variance < 50) setSharpnessWarning(true);
        });
      };
      img.onerror = () => {
        // Not an image (e.g. PDF) – store as-is
        onChange({ name: file.name, dataUrl: ev.target.result });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (value) {
    const isImage = value.dataUrl && value.dataUrl.startsWith('data:image');
    return (
      <div>
        <div style={{ border: '1.5px solid #10b981', borderRadius: 8, padding: '12px 16px', background: '#f0fdf4', display: 'flex', alignItems: 'center', gap: 12 }}>
          {isImage && (
            <img src={value.dataUrl} alt={value.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #d1d5db' }} />
          )}
          {!isImage && <span style={{ fontSize: 24 }}>📄</span>}
          <div style={{ flex: 1, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value.name}
          </div>
          <button
            type="button"
            onClick={() => { onChange(null); setSharpnessWarning(false); }}
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
          >
            {t?.upload?.remove || 'Remove'}
          </button>
        </div>
        {sharpnessWarning && (
          <div style={{
            background: '#fff7ed',
            border: '1px solid #fdba74',
            borderRadius: 6,
            padding: '8px 12px',
            marginTop: 8,
            fontSize: 13,
            color: '#9a3412'
          }}>
            ⚠️ Dieses Bild wirkt unscharf. Bitte ein schärferes Foto hochladen.
          </div>
        )}
      </div>
    );
  }

  return (
    <label
      className="upload-area"
      style={{ display: 'block' }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => handleFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <div className="upload-icon">📎</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t?.upload?.click || 'Click or drag file here'}</div>
      <div style={{ fontSize: 12 }}>{t?.upload?.types || 'JPG, PNG, PDF up to 10 MB'}</div>
    </label>
  );
}
