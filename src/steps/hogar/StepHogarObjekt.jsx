import { useState } from 'react';
import Field from '../../components/Field';

const T = {
  de: {
    title: 'Objekt-Details',
    subtitle: 'Angaben zur zu versichernden Immobilie.',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    artLabel: 'Art der Immobilie',
    haus: 'Haus', wohnung: 'Wohnung',
    hausart: 'Hausart',
    reihenhaus: 'Reihenhaus', alleinstehend: 'Alleinstehendes Haus',
    lage: 'Lage der Wohnung',
    erdgeschoss: 'Erdgeschoss', obergeschoss: 'Obergeschoss', mittelgeschoss: 'Mittelgeschoss',
    baujahr: 'Baujahr',
    saniert: 'Wurde das Objekt komplett saniert?',
    ja: 'Ja', nein: 'Nein',
    saniertJahr: 'Jahr der Sanierung',
    kataster: 'Kataster-Nummer',
    katasterHint: 'Mit der Kataster-Nummer kann Rita Baujahr und m² öffentlich einsehen. Angabe freiwillig.',
    flaechen: 'Flächen',
    bebaute: 'm² bebaute Fläche',
    weitere: 'Weitere Nutzflächen',
    weiterePlaceholder: 'z.B. Balkon 12m², Garage 20m², Abstellraum 5m² – bitte alle Flächen und m² angeben',
    errors: {
      art: 'Art der Immobilie', lage: 'Lage der Wohnung', hausart: 'Hausart',
      baujahr: 'Baujahr', saniert: 'Wurde das Objekt saniert?', saniertJahr: 'Jahr der Sanierung',
      bebaute: 'm² bebaute Fläche', weitere: 'Weitere Nutzflächen',
    },
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    back: '← Zurück', next: 'Weiter →',
  },
  en: {
    title: 'Property Details',
    subtitle: 'Details about the property to be insured.',
    errorHeader: '❌ Please fill in all required fields:',
    artLabel: 'Type of property',
    haus: 'House', wohnung: 'Apartment',
    hausart: 'House type',
    reihenhaus: 'Terraced house', alleinstehend: 'Detached house',
    lage: 'Apartment location',
    erdgeschoss: 'Ground floor', obergeschoss: 'Upper floor', mittelgeschoss: 'Middle floor',
    baujahr: 'Year of construction',
    saniert: 'Has the property been fully renovated?',
    ja: 'Yes', nein: 'No',
    saniertJahr: 'Year of renovation',
    kataster: 'Cadastre number',
    katasterHint: 'With the cadastre number Rita can look up year of construction and m² publicly. Optional.',
    flaechen: 'Areas',
    bebaute: 'Built-up area (m²)',
    weitere: 'Additional usable areas',
    weiterePlaceholder: 'e.g. Balcony 12m², Garage 20m², Storage room 5m² – please list all areas and m²',
    errors: {
      art: 'Type of property', lage: 'Apartment location', hausart: 'House type',
      baujahr: 'Year of construction', saniert: 'Renovation (Yes/No)', saniertJahr: 'Year of renovation',
      bebaute: 'Built-up area (m²)', weitere: 'Additional usable areas',
    },
    requiredHint: '⚠️ Please fill in all required fields',
    back: '← Back', next: 'Next →',
  },
};

export default function StepHogarObjekt({ data, onChange, flaechen, onChangeFlaechen, onNext, onPrev, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const ff = (field) => ({
    value: flaechen[field] || '',
    onChange: e => onChangeFlaechen({ [field]: e.target.value }),
    className: attempted && !flaechen[field] ? 'field-error' : flaechen[field] ? 'filled' : '',
  });

  const selectTyp = (typ) => {
    onChange({ typ, wohnung_lage: '', haus_art: '' });
  };

  const canNext =
    data.typ &&
    (data.typ === 'wohnung' ? data.wohnung_lage : data.haus_art) &&
    data.baujahr &&
    data.saniert &&
    (data.saniert === 'ja' ? data.saniert_jahr : true) &&
    flaechen.bebaute_flaeche && flaechen.weitere_flaechen;

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
      <h2 className="step-title">{t.title}</h2>
      <p className="step-subtitle">{t.subtitle}</p>

      {attempted && !canNext && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#b91c1c'
        }}>
          {t.errorHeader}<br/>
          <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
            {!data.typ && <li>{t.errors.art}</li>}
            {data.typ && missingSubType && <li>{data.typ === 'wohnung' ? t.errors.lage : t.errors.hausart}</li>}
            {!data.baujahr && <li>{t.errors.baujahr}</li>}
            {!data.saniert && <li>{t.errors.saniert}</li>}
            {data.saniert === 'ja' && !data.saniert_jahr && <li>{t.errors.saniertJahr}</li>}
            {!flaechen.bebaute_flaeche && <li>{t.errors.bebaute}</li>}
            {!flaechen.weitere_flaechen && <li>{t.errors.weitere}</li>}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
          {t.artLabel} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={cardStyle('haus')} onClick={() => selectTyp('haus')}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 16 }}>{t.haus}</div>
          </div>
          <div style={cardStyle('wohnung')} onClick={() => selectTyp('wohnung')}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🏢</div>
            <div style={{ fontSize: 16 }}>{t.wohnung}</div>
          </div>
        </div>
      </div>

      {data.typ === 'haus' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.haus_art ? '#b91c1c' : '#374151'
          }}>
            {t.hausart} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'reihenhaus', label: t.reihenhaus },
              { value: 'alleinstehendes_haus', label: t.alleinstehend },
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
            {t.lage} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'erdgeschoss', label: t.erdgeschoss },
              { value: 'obergeschoss', label: t.obergeschoss },
              { value: 'mittelgeschoss', label: t.mittelgeschoss },
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
        <Field label={t.baujahr} required>
          <input type="number" placeholder="z.B. 1985" min="1800" max="2026" {...f('baujahr')} />
        </Field>
      </div>

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label style={{
          fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
          color: attempted && !data.saniert ? '#b91c1c' : '#374151'
        }}>
          {t.saniert} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div className="radio-group">
          {[
            { value: 'ja', label: t.ja },
            { value: 'nein', label: t.nein },
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
          <Field label={t.saniertJahr} required>
            <input type="number" placeholder="z.B. 2015" min="1800" max="2026" {...f('saniert_jahr')} />
          </Field>
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <Field label={t.kataster} optional full>
          <input type="text" placeholder="z.B. 1234567AB1234A0001ZZ" {...f('kataster')} />
        </Field>
      </div>
      <div style={{
        background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8,
        padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 24,
        display: 'flex', gap: 8,
      }}>
        <span>💡</span>
        <span>{t.katasterHint}</span>
      </div>

      {/* Flächen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px', color: '#6b7280' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{t.flaechen}</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
      </div>

      <div className="form-grid">
        <Field label={t.bebaute} required>
          <input type="number" placeholder="z.B. 95" min="1" {...ff('bebaute_flaeche')} />
        </Field>
        <Field label={t.weitere} required full>
          <textarea placeholder={t.weiterePlaceholder} {...ff('weitere_flaechen')} />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>{t.back}</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>{t.requiredHint}</span>
          )}
          <button className="btn btn-hogar" onClick={handleNext}>{t.next}</button>
        </div>
      </div>
    </div>
  );
}
