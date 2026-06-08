import { useState } from 'react';
import Field from '../components/Field';

export default function StepScheibe({ data, onChange, onNext, onPrev, t }) {
  const s = t.scheibe;
  const [attempted, setAttempted] = useState(false);

  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });

  const canNext = data.reparatur && data.datum && data.beschreibung;

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
            {!data.reparatur && <li>Reparaturweg</li>}
            {!data.datum && <li>Datum des Schadens</li>}
            {!data.beschreibung && <li>Schadensbeschreibung</li>}
          </ul>
        </div>
      )}

      <div className="form-grid single">
        <Field label={s.reparatur} required>
          <select
            value={data.reparatur}
            onChange={set('reparatur')}
            className={attempted && !data.reparatur ? 'field-error' : data.reparatur ? 'filled' : ''}
          >
            <option value="">–</option>
            <option value="carglas">{s.reparatur_carglas}</option>
            <option value="werkstatt">{s.reparatur_werkstatt}</option>
            <option value="generali">{s.reparatur_generali}</option>
          </select>
        </Field>

        <Field label={s.datum} required>
          <input
            type="date"
            value={data.datum || ''}
            onChange={set('datum')}
            className={attempted && !data.datum ? 'field-error' : data.datum ? 'filled' : ''}
          />
        </Field>

        <Field label={s.beschreibung} required>
          <textarea
            value={data.beschreibung}
            onChange={set('beschreibung')}
            className={attempted && !data.beschreibung ? 'field-error' : data.beschreibung ? 'filled' : ''}
            placeholder={s.beschreibung_hint}
            rows={4}
          />
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
