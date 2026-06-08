const AUSSTATTUNG_OPTIONS = [
  { key: 'pool', label: 'Pool' },
  { key: 'alarm', label: 'Alarmsystem' },
  { key: 'klima', label: 'Klimaanlage (fest eingebaut)' },
  { key: 'pv', label: 'Photovoltaik' },
  { key: 'garage', label: 'Garage' },
  { key: 'keller', label: 'Keller' },
  { key: 'kamin', label: 'Kamin' },
  { key: 'wertsachen', label: 'Wertsachen über 3.000 €' },
];

export default function StepHogarAusstattung({ data, onChange, onNext, onPrev }) {
  const toggle = (key) => {
    const current = data[key] || false;
    onChange({ [key]: !current });
  };

  return (
    <div>
      <h2 className="step-title">Besonderheiten & Ausstattung</h2>
      <p className="step-subtitle">Bitte wählen Sie alle zutreffenden Ausstattungsmerkmale aus (optional).</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 32 }}>
        {AUSSTATTUNG_OPTIONS.map(opt => (
          <label
            key={opt.key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              border: `2px solid ${data[opt.key] ? '#cc0000' : '#d1d5db'}`,
              borderRadius: 10,
              cursor: 'pointer',
              background: data[opt.key] ? '#fff5f5' : 'white',
              color: data[opt.key] ? '#cc0000' : '#374151',
              fontWeight: data[opt.key] ? 600 : 400,
              transition: 'all 0.2s',
              fontSize: 14,
            }}
          >
            <input
              type="checkbox"
              checked={!!data[opt.key]}
              onChange={() => toggle(opt.key)}
              style={{ width: 16, height: 16, accentColor: '#cc0000' }}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <button className="btn btn-hogar" onClick={onNext}>Weiter →</button>
      </div>
    </div>
  );
}
