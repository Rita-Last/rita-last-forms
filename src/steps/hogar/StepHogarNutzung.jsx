import { useState } from 'react';
import Field from '../../components/Field';

export default function StepHogarNutzung({ data, flaechen, onChange, onChangeFlaechen, onNext, onPrev }) {
  const [attempted, setAttempted] = useState(false);

  const ff = (field) => ({
    value: flaechen[field] || '',
    onChange: e => onChangeFlaechen({ [field]: e.target.value }),
    className: attempted && !flaechen[field] ? 'field-error' : flaechen[field] ? 'filled' : '',
  });

  const selectArt = (art) => {
    onChange({ art, eigennutzung_typ: '', vermietung_typ: '' });
  };

  const canNext =
    data.art &&
    (data.art === 'eigennutzung' ? data.eigennutzung_typ : data.vermietung_typ) &&
    flaechen.bebaute_flaeche && flaechen.weitere_flaechen;

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  const missingSubTyp = data.art === 'eigennutzung' ? !data.eigennutzung_typ : !data.vermietung_typ;

  const cardStyle = (val) => ({
    border: `2px solid ${data.art === val ? '#cc0000' : attempted && !data.art ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 12,
    padding: '20px 16px',
    cursor: 'pointer',
    background: data.art === val ? '#fff5f5' : attempted && !data.art ? '#fef2f2' : 'white',
    color: data.art === val ? '#cc0000' : '#374151',
    fontWeight: data.art === val ? 700 : 400,
    transition: 'all 0.2s',
    flex: 1,
  });

  return (
    <div>
      <h2 className="step-title">Nutzung & Flächen</h2>
      <p className="step-subtitle">Wie wird die Immobilie genutzt und welche Flächen hat sie?</p>

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
            {!data.art && <li>Nutzungsart der Immobilie</li>}
            {data.art && missingSubTyp && <li>{data.art === 'eigennutzung' ? 'Eigennutzungsart' : 'Vermietungsart'}</li>}
            {!flaechen.bebaute_flaeche && <li>m² bebaute Fläche</li>}
            {!flaechen.weitere_flaechen && <li>Weitere Nutzflächen</li>}
          </ul>
        </div>
      )}

      {/* Nutzungsart */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
          Wie wird die Immobilie genutzt? <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={cardStyle('eigennutzung')} onClick={() => selectArt('eigennutzung')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🏡</div>
            <div style={{ fontSize: 15 }}>Eigennutzung</div>
          </div>
          <div style={cardStyle('vermietet')} onClick={() => selectArt('vermietet')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔑</div>
            <div style={{ fontSize: 15 }}>Vermietet</div>
          </div>
        </div>
      </div>

      {data.art === 'eigennutzung' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.eigennutzung_typ ? '#b91c1c' : '#374151'
          }}>
            Nutzungsart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'hauptwohnsitz', label: 'Hauptwohnsitz' },
              { value: 'nebenwohnsitz', label: 'Nebenwohnsitz' },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="eigennutzung_typ"
                  value={opt.value}
                  checked={data.eigennutzung_typ === opt.value}
                  onChange={() => onChange({ eigennutzung_typ: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {data.art === 'vermietet' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.vermietung_typ ? '#b91c1c' : '#374151'
          }}>
            Vermietungsart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'langzeit', label: 'Langzeitvermietung' },
              { value: 'saisonal', label: 'Saisonale Vermietung' },
              { value: 'touristisch', label: 'Touristische Vermietung' },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="vermietung_typ"
                  value={opt.value}
                  checked={data.vermietung_typ === opt.value}
                  onChange={() => onChange({ vermietung_typ: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        margin: '24px 0 16px', color: '#6b7280',
      }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Flächen</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
      </div>

      <div className="form-grid">
        <Field label="m² bebaute Fläche" required>
          <input type="number" placeholder="z.B. 95" min="1" {...ff('bebaute_flaeche')} />
        </Field>
        <Field label="Weitere Nutzflächen" required full>
          <textarea
            placeholder="z.B. Balkon 12m², Garage 20m², Abstellraum 5m² – bitte alle Flächen und m² angeben"
            {...ff('weitere_flaechen')}
          />
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
