import { useState } from 'react';

export default function StepSchadensart({ value, onChange, onNext, onPrev, t }) {
  const s = t.schadensart;
  const [attempted, setAttempted] = useState(false);

  const canNext = !!value;

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  const options = [
    { id: 'scheibe', icon: '🪟', label: s.scheibe },
    { id: 'unfall_gegner', icon: '🚗', label: s.unfall_gegner },
    { id: 'unfall_eigen', icon: '🔧', label: s.unfall_eigen },
    { id: 'diebstahl', icon: '🔓', label: s.diebstahl },
  ];

  return (
    <div>
      <h2 className="step-title">{s.title}</h2>
      <p className="step-subtitle">{s.subtitle}</p>

      {attempted && !canNext && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 14,
          color: '#b91c1c'
        }}>
          ❌ Bitte füllen Sie alle Pflichtfelder aus:<br/>
          <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
            <li>Schadensart auswählen</li>
          </ul>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '24px 16px',
              border: `2px solid ${value === opt.id ? '#1a56db' : attempted && !value ? '#ef4444' : '#d1d5db'}`,
              borderRadius: 12,
              background: value === opt.id ? '#eff6ff' : attempted && !value ? '#fef2f2' : 'white',
              color: value === opt.id ? '#1a56db' : '#374151',
              cursor: 'pointer',
              fontWeight: value === opt.id ? 700 : 500,
              fontSize: 15,
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 36 }}>{opt.icon}</span>
            <span style={{ textAlign: 'center', lineHeight: 1.3 }}>{opt.label}</span>
          </button>
        ))}
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>{t.nav.prev}</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>
              ⚠️ Bitte alle Pflichtfelder ausfüllen
            </span>
          )}
          <button className="btn btn-primary" onClick={handleNext}>{t.nav.next}</button>
        </div>
      </div>
    </div>
  );
}
