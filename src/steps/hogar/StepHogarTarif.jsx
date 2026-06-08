const TARIFE = [
  {
    value: 'esencial',
    label: 'Esencial',
    desc: 'Basisschutz – Feuer, Wasser, Einbruch',
  },
  {
    value: 'confortable',
    label: 'Confortable',
    desc: 'Erweiterter Schutz – inkl. Glasbruch & Haftpflicht',
  },
  {
    value: 'exclusivo',
    label: 'Exclusivo',
    desc: 'Rundum-Schutz – Premiumleistungen & Assistance',
  },
];

export default function StepHogarTarif({ data, onChange, onNext, onPrev }) {
  return (
    <div>
      <h2 className="step-title">Tarif-Wunsch</h2>
      <p className="step-subtitle">Unverbindliche Präferenz – Rita erstellt das beste Angebot für Sie.</p>

      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {TARIFE.map(tarif => (
          <div
            key={tarif.value}
            onClick={() => onChange({ tarif: data.tarif === tarif.value ? '' : tarif.value })}
            style={{
              border: `2px solid ${data.tarif === tarif.value ? '#cc0000' : '#d1d5db'}`,
              borderRadius: 12,
              padding: '16px 20px',
              cursor: 'pointer',
              background: data.tarif === tarif.value ? '#fff5f5' : 'white',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: `2px solid ${data.tarif === tarif.value ? '#cc0000' : '#d1d5db'}`,
                background: data.tarif === tarif.value ? '#cc0000' : 'white',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {data.tarif === tarif.value && (
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: data.tarif === tarif.value ? '#cc0000' : '#111827' }}>
                {tarif.label}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{tarif.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#991b1b', marginBottom: 24 }}>
        Unverbindliche Präferenz – Rita erstellt das beste Angebot für Sie
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <button className="btn btn-hogar" onClick={onNext}>Weiter →</button>
      </div>
    </div>
  );
}
