import { useState } from 'react';
import Field from '../components/Field';

export default function StepPersonal({ data, onChange, onNext, onPrev, t }) {
  const s = t.personal;
  const [attempted, setAttempted] = useState(false);

  const f = (field) => ({
    value: data[field],
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const canNext = data.vorname && data.nachname && data.email && data.telefon && data.strasse && data.plz && data.ort;

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
            {!data.vorname && <li>Vorname</li>}
            {!data.nachname && <li>Nachname</li>}
            {!data.email && <li>E-Mail</li>}
            {!data.telefon && <li>Telefon</li>}
            {!data.strasse && <li>Straße</li>}
            {!data.plz && <li>PLZ</li>}
            {!data.ort && <li>Ort</li>}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <Field label={s.vorname} required>
          <input type="text" placeholder="Max" {...f('vorname')} />
        </Field>
        <Field label={s.nachname} required>
          <input type="text" placeholder="Mustermann" {...f('nachname')} />
        </Field>
        <Field label={s.email} required>
          <input type="email" placeholder="name@example.com" {...f('email')} />
        </Field>
        <Field label={s.telefon} required>
          <input type="tel" placeholder="+34 600 000 000" {...f('telefon')} />
        </Field>
        <Field label={s.strasse} required full>
          <input type="text" placeholder="Musterstraße 12" {...f('strasse')} />
        </Field>
        <Field label={s.plz} required>
          <input type="text" placeholder="28001" {...f('plz')} />
        </Field>
        <Field label={s.ort} required>
          <input type="text" placeholder="Madrid" {...f('ort')} />
        </Field>
        <Field label={s.police_nr} full>
          <input type="text" placeholder="z.B. 123456789 / e.g. 123456789" {...f('police_nr')} />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 'auto' }}>
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
