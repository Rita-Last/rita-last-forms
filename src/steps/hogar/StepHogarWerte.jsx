import { useState } from 'react';
import Field from '../../components/Field';

export default function StepHogarWerte({ data, onChange, onNext, onPrev }) {
  const [attempted, setAttempted] = useState(false);

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const canNext = data.wiederaufbauwert && data.wiederbeschaffungswert && data.wertgegenstaende;

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
      <h2 className="step-title">Werte</h2>
      <p className="step-subtitle">Angaben zu den Versicherungswerten Ihrer Immobilie.</p>

      <div style={{
        background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 8,
        padding: '12px 16px', fontSize: 13, color: '#1e40af', marginBottom: 24,
        display: 'flex', gap: 8,
      }}>
        <span>ℹ️</span>
        <span>
          Diese Angaben sind wichtig für die korrekte Berechnung Ihres Versicherungsschutzes.
          Im Zweifelsfall unterstützt Rita Sie gerne bei der Schätzung.
        </span>
      </div>

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
            {!data.wiederaufbauwert && <li>Wiederaufbauwert des Gebäudes</li>}
            {!data.wiederbeschaffungswert && <li>Wiederbeschaffungswert des Hausrates</li>}
            {!data.wertgegenstaende && <li>Wertgegenstände</li>}
          </ul>
        </div>
      )}

      <div className="form-grid single">
        <Field label="Wiederaufbauwert des Gebäudes in €" required>
          <input type="number" placeholder="z.B. 250000" min="0" {...f('wiederaufbauwert')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            Kosten für den vollständigen Wiederaufbau des Gebäudes. Falls ohne Gebäude (z.B. als Mieter/in) bitte „0" schreiben.
          </span>
        </Field>
        <Field label="Wiederbeschaffungswert des Hausrates inkl. Küche in €" required>
          <input type="number" placeholder="z.B. 30000" min="0" {...f('wiederbeschaffungswert')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            Gesamtwert aller Einrichtungsgegenstände und der Küche
          </span>
        </Field>
        <Field label="Wertgegenstände" required>
          <textarea
            placeholder="Falls keine Wertgegenstände vorhanden: bitte 'Keine' eintragen"
            {...f('wertgegenstaende')}
          />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            z.B. Schmuck 5.000€, Gemälde 3.000€ – bitte einzeln aufführen
          </span>
        </Field>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
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
