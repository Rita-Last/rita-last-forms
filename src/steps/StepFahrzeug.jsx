import { useState } from 'react';
import Field from '../components/Field';

export default function StepFahrzeug({ data, onChange, onNext, onPrev, t }) {
  const s = t.fahrzeug;
  const [attempted, setAttempted] = useState(false);

  const f = (field) => ({
    value: data[field],
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const canNext = data.kennzeichen && data.marke;

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

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
            {!data.kennzeichen && <li>Kennzeichen</li>}
            {!data.marke && <li>Marke / Modell</li>}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <Field label={s.kennzeichen} required>
          <input
            type="text"
            placeholder="MA-1234-AB"
            value={data.kennzeichen}
            onChange={e => onChange({ ...data, kennzeichen: e.target.value.toUpperCase() })}
            className={attempted && !data.kennzeichen ? 'field-error' : data.kennzeichen ? 'filled' : ''}
            style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}
          />
        </Field>
        <Field label={s.marke} required>
          <input type="text" placeholder="z.B. Volkswagen, BMW, Seat" {...f('marke')} />
        </Field>
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
