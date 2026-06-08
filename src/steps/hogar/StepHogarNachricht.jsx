import Field from '../../components/Field';

export default function StepHogarNachricht({ data, onChange, onNext, onPrev }) {
  const canNext = data.datenschutz;

  return (
    <div>
      <h2 className="step-title">Nachricht & Datenschutz</h2>
      <p className="step-subtitle">Optionale Nachricht und Datenschutzbestimmungen.</p>

      <div style={{ marginBottom: 20 }}>
        <Field label="Ihre Nachricht an Rita" optional full>
          <textarea
            placeholder="Haben Sie besondere Wünsche oder Anmerkungen?"
            value={data.nachricht || ''}
            onChange={e => onChange({ nachricht: e.target.value })}
            className={data.nachricht ? 'filled' : ''}
            rows={5}
          />
        </Field>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
          padding: '14px 16px',
          border: `2px solid ${data.datenschutz ? '#cc0000' : '#d1d5db'}`,
          borderRadius: 10,
          background: data.datenschutz ? '#fff5f5' : 'white',
          transition: 'all 0.2s',
        }}>
          <input
            type="checkbox"
            checked={!!data.datenschutz}
            onChange={e => onChange({ datenschutz: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: '#cc0000', marginTop: 1, flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#374151' }}>
            Ich habe die Datenschutzerklärung gelesen und akzeptiere sie.{' '}
            <span style={{ color: '#cc0000' }}>*</span>
          </span>
        </label>

        <label style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          cursor: 'pointer',
          padding: '14px 16px',
          border: `2px solid ${data.kontakt_erlaubt ? '#cc0000' : '#d1d5db'}`,
          borderRadius: 10,
          background: data.kontakt_erlaubt ? '#fff5f5' : 'white',
          transition: 'all 0.2s',
        }}>
          <input
            type="checkbox"
            checked={!!data.kontakt_erlaubt}
            onChange={e => onChange({ kontakt_erlaubt: e.target.checked })}
            style={{ width: 18, height: 18, accentColor: '#cc0000', marginTop: 1, flexShrink: 0 }}
          />
          <span style={{ fontSize: 14, color: '#374151' }}>
            Ich bin damit einverstanden, per Telefon und/oder E-Mail kontaktiert zu werden.
          </span>
        </label>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <button className="btn btn-hogar" onClick={onNext} disabled={!canNext}>
          Weiter →
        </button>
      </div>
    </div>
  );
}
