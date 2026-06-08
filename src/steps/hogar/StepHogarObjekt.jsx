import { useState } from 'react';
import Field from '../../components/Field';

export default function StepHogarObjekt({ data, onChange, onNext, onPrev }) {
  const [attempted, setAttempted] = useState(false);

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const selectTyp = (typ) => {
    onChange({ typ, wohnung_lage: '', haus_art: '' });
  };

  const canNext =
    data.typ &&
    (data.typ === 'wohnung' ? data.wohnung_lage : data.haus_art) &&
    data.baujahr &&
    data.saniert &&
    (data.saniert === 'ja' ? data.saniert_jahr : true);

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  const missingSubType = data.typ === 'wohnung' ? !data.wohnung_lage : !data.haus_art;

  const cardStyle = (val) => ({
    border: `2px solid ${data.typ === val ? '#cc0000' : attempted && !data.typ ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 12,
    padding: '20px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    background: data.typ === val ? '#fff5f5' : attempted && !data.typ ? '#fef2f2' : 'white',
    color: data.typ === val ? '#cc0000' : '#374151',
    fontWeight: data.typ === val ? 700 : 400,
    transition: 'all 0.2s',
    flex: 1,
  });

  return (
    <div>
      <h2 className="step-title">Objekt-Details</h2>
      <p className="step-subtitle">Angaben zur zu versichernden Immobilie.</p>

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
            {!data.typ && <li>Art der Immobilie</li>}
            {data.typ && missingSubType && <li>{data.typ === 'wohnung' ? 'Lage der Wohnung' : 'Hausart'}</li>}
            {!data.baujahr && <li>Baujahr</li>}
            {!data.saniert && <li>Wurde das Objekt saniert?</li>}
            {data.saniert === 'ja' && !data.saniert_jahr && <li>Jahr der Sanierung</li>}
          </ul>
        </div>
      )}

      {/* Type selection */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
          Art der Immobilie <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={cardStyle('haus')} onClick={() => selectTyp('haus')}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 16 }}>Haus</div>
          </div>
          <div style={cardStyle('wohnung')} onClick={() => selectTyp('wohnung')}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🏢</div>
            <div style={{ fontSize: 16 }}>Wohnung</div>
          </div>
        </div>
      </div>

      {/* Conditional sub-options */}
      {data.typ === 'haus' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.haus_art ? '#b91c1c' : '#374151'
          }}>
            Hausart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'reihenhaus', label: 'Reihenhaus' },
              { value: 'alleinstehendes_haus', label: 'Alleinstehendes Haus' },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="haus_art"
                  value={opt.value}
                  checked={data.haus_art === opt.value}
                  onChange={() => onChange({ haus_art: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {data.typ === 'wohnung' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.wohnung_lage ? '#b91c1c' : '#374151'
          }}>
            Lage der Wohnung <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'erdgeschoss', label: 'Erdgeschoss' },
              { value: 'obergeschoss', label: 'Obergeschoss' },
              { value: 'mittelgeschoss', label: 'Mittelgeschoss' },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="wohnung_lage"
                  value={opt.value}
                  checked={data.wohnung_lage === opt.value}
                  onChange={() => onChange({ wohnung_lage: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-grid">
        <Field label="Baujahr" required>
          <input type="number" placeholder="z.B. 1985" min="1800" max="2026" {...f('baujahr')} />
        </Field>
      </div>

      {/* Sanierung */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label style={{
          fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
          color: attempted && !data.saniert ? '#b91c1c' : '#374151'
        }}>
          Wurde das Objekt komplett saniert? <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div className="radio-group">
          {[
            { value: 'ja', label: 'Ja' },
            { value: 'nein', label: 'Nein' },
          ].map(opt => (
            <label key={opt.value} className="radio-option hogar">
              <input
                type="radio"
                name="saniert"
                value={opt.value}
                checked={data.saniert === opt.value}
                onChange={() => onChange({ saniert: opt.value, saniert_jahr: opt.value === 'nein' ? '' : data.saniert_jahr })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {data.saniert === 'ja' && (
        <div className="form-grid" style={{ marginBottom: 16 }}>
          <Field label="Jahr der Sanierung" required>
            <input type="number" placeholder="z.B. 2015" min="1800" max="2026" {...f('saniert_jahr')} />
          </Field>
        </div>
      )}

      {/* Kataster */}
      <div style={{ marginBottom: 8 }}>
        <Field label="Kataster-Nummer" optional full>
          <input type="text" placeholder="z.B. 1234567AB1234A0001ZZ" {...f('kataster')} />
        </Field>
      </div>
      <div style={{
        background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8,
        padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 24,
        display: 'flex', gap: 8,
      }}>
        <span>💡</span>
        <span>Mit der Kataster-Nummer kann Rita Baujahr und m² öffentlich einsehen. Angabe freiwillig.</span>
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
