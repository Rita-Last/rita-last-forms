import { useState } from 'react';
import Field from '../../components/Field';

export default function StepHogarPersonal({ data, adresse, onChange, onChangeAdresse, onNext }) {
  const [attempted, setAttempted] = useState(false);

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });
  const fa = (field) => ({
    value: adresse[field] || '',
    onChange: e => onChangeAdresse({ [field]: e.target.value }),
    className: attempted && !adresse[field] ? 'field-error' : adresse[field] ? 'filled' : '',
  });

  const canNext =
    data.vorname && data.nachname && data.nie && data.geburtsdatum && data.email &&
    adresse.plz && adresse.ort;

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
      <h2 className="step-title">Persönliche Daten & Adresse</h2>
      <p className="step-subtitle">Bitte geben Sie Ihre persönlichen Kontaktdaten ein.</p>

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
            {!data.nie && <li>NIE-Nummer</li>}
            {!data.geburtsdatum && <li>Geburtsdatum</li>}
            {!data.email && <li>E-Mail</li>}
            {!adresse.plz && <li>PLZ</li>}
            {!adresse.ort && <li>Ort / Gemeinde</li>}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <Field label="Vorname" required>
          <input type="text" placeholder="Max" {...f('vorname')} />
        </Field>
        <Field label="Nachname" required>
          <input type="text" placeholder="Mustermann" {...f('nachname')} />
        </Field>
        <Field label="NIE-Nummer" required>
          <input type="text" placeholder="X1234567A" {...f('nie')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            Número de Identificación de Extranjero
          </span>
        </Field>
        <Field label="Geburtsdatum" required>
          <input type="date" {...f('geburtsdatum')} />
        </Field>
        <Field label="E-Mail" required full>
          <input type="email" placeholder="name@example.com" {...f('email')} />
        </Field>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        margin: '24px 0 16px', color: '#6b7280',
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Adresse der Immobilie</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
      </div>

      <div className="form-grid">
        <Field label="Straße & Hausnummer" optional full>
          <input type="text" placeholder="Calle Mayor 1" {...fa('strasse')} />
        </Field>
        <Field label="PLZ" required>
          <input type="text" placeholder="28001" {...fa('plz')} />
        </Field>
        <Field label="Ort / Gemeinde" required>
          <input type="text" placeholder="Madrid" {...fa('ort')} />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 'auto' }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>
              ⚠️ Bitte alle Pflichtfelder ausfüllen
            </span>
          )}
          <button className="btn btn-hogar" onClick={handleNext}>Weiter →</button>
        </div>
      </div>
    </div>
  );
}
