import { useState } from 'react';
import Field from '../../components/Field';

const T = {
  de: {
    title: 'Fahrzeug-Daten',
    subtitle: 'Angaben zum zu versichernden Fahrzeug.',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    marke: 'Marke', modell: 'Modell',
    version: 'Version', versionPlaceholder: 'z.B. Confortline, Sport, Premium',
    ps: 'PS', psPlaceholder: 'z.B. 120',
    kraftstoff: 'Kraftstoff', diesel: 'Diesel', benzin: 'Benzin', elektrisch: 'Elektrisch', hybrid: 'Hybrid',
    tueren: 'Anzahl Türen', drei: '3 Türer', fuenf: '5 Türer',
    ccm: 'Hubraum (ccm)', ccmPlaceholder: 'z.B. 1600',
    baujahr: 'Baujahr', baujahrPlaceholder: 'z.B. 2019',
    kennzeichen: 'Kennzeichen', kennzeichenPlaceholder: 'z.B. PM-1234-AB',
    extras: 'Extras / Sonderausstattung',
    extrasHint: 'Nachträglich am Fahrzeug angebrachtes Zubehör, das nicht zur serienmäßigen Ausstattung gehört; bitte einzeln aufführen und den jeweiligen Wert angeben.',
    extrasInfo: 'Bitte Extras einzeln aufführen (optional)',
    extrasPlaceholder: 'z.B. Anhängerkupplung 500€, Sitzheizung 300€',
    privat: 'Nur zur privaten Nutzung?',
    privatNote: 'Ohne Einfahrt in bzw. Befahren von Hafen- oder Flughafengeländen.',
    privatInfo: 'Zusätzliche Infos (optional)',
    privatPlaceholder: 'z.B. gelegentliche Nutzung für Arbeitsweg',
    ja: 'Ja', nein: 'Nein',
    errors: {
      marke: 'Marke', modell: 'Modell', version: 'Version', ps: 'PS',
      kraftstoff: 'Kraftstoff', tueren: 'Anzahl Türen',
      baujahr: 'Baujahr', kennzeichen: 'Kennzeichen',
      extras: 'Extras (Ja/Nein)', privat: 'Private Nutzung (Ja/Nein)',
    },
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    back: '← Zurück', next: 'Weiter →',
  },
  en: {
    title: 'Vehicle Data',
    subtitle: 'Details about the vehicle to be insured.',
    errorHeader: '❌ Please fill in all required fields:',
    marke: 'Make', modell: 'Model',
    version: 'Version', versionPlaceholder: 'e.g. Comfortline, Sport, Premium',
    ps: 'Horsepower (HP)', psPlaceholder: 'e.g. 120',
    kraftstoff: 'Fuel type', diesel: 'Diesel', benzin: 'Petrol', elektrisch: 'Electric', hybrid: 'Hybrid',
    tueren: 'Number of doors', drei: '3 doors', fuenf: '5 doors',
    ccm: 'Engine displacement (cc)', ccmPlaceholder: 'e.g. 1600',
    baujahr: 'Year of manufacture', baujahrPlaceholder: 'e.g. 2019',
    kennzeichen: 'Number plate', kennzeichenPlaceholder: 'e.g. PM-1234-AB',
    extras: 'Extras / Special equipment',
    extrasHint: 'Accessories added to the vehicle after manufacture that are not part of the standard equipment; please list each item and its value.',
    extrasInfo: 'Please list extras individually (optional)',
    extrasPlaceholder: 'e.g. Tow bar €500, Heated seats €300',
    privat: 'For private use only?',
    privatNote: 'Excluding entry to or driving on port or airport premises.',
    privatInfo: 'Additional info (optional)',
    privatPlaceholder: 'e.g. occasional use for commuting',
    ja: 'Yes', nein: 'No',
    errors: {
      marke: 'Make', modell: 'Model', version: 'Version', ps: 'Horsepower',
      kraftstoff: 'Fuel type (Diesel/Petrol)', tueren: 'Number of doors',
      baujahr: 'Year of manufacture', kennzeichen: 'Number plate',
      extras: 'Extras (Yes/No)', privat: 'Private use only (Yes/No)',
    },
    requiredHint: '⚠️ Please fill in all required fields',
    back: '← Back', next: 'Next →',
  },
};

export default function StepAutoFahrzeug({ data, onChange, onNext, onPrev, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const textFields = ['marke', 'modell', 'version', 'ps', 'baujahr', 'kennzeichen'];
  const radioFields = ['kraftstoff', 'tueren', 'extras', 'privat_nutzung'];

  const canNext =
    textFields.every(f => data[f]) &&
    radioFields.every(f => data[f]);

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  const missingErrors = attempted && !canNext ? [
    !data.marke && t.errors.marke,
    !data.modell && t.errors.modell,
    !data.version && t.errors.version,
    !data.ps && t.errors.ps,
    !data.kraftstoff && t.errors.kraftstoff,
    !data.tueren && t.errors.tueren,
    !data.baujahr && t.errors.baujahr,
    !data.kennzeichen && t.errors.kennzeichen,
    !data.extras && t.errors.extras,
    !data.privat_nutzung && t.errors.privat,
  ].filter(Boolean) : [];

  const radioStyle = (field, val) => ({
    border: `2px solid ${data[field] === val ? '#cc0000' : attempted && !data[field] ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 10,
    padding: '12px 18px',
    cursor: 'pointer',
    background: data[field] === val ? '#fff5f5' : attempted && !data[field] ? '#fef2f2' : 'white',
    color: data[field] === val ? '#cc0000' : '#374151',
    fontWeight: data[field] === val ? 700 : 500,
    fontSize: 14,
    transition: 'all 0.2s',
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
          {t.errorHeader}<br />
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            {missingErrors.map(e => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <Field label={t.marke} required>
          <input type="text" placeholder="z.B. Volkswagen" {...f('marke')} />
        </Field>
        <Field label={t.modell} required>
          <input type="text" placeholder="z.B. Golf" {...f('modell')} />
        </Field>
        <Field label={t.version} required full>
          <input type="text" placeholder={t.versionPlaceholder} {...f('version')} />
        </Field>
        <Field label={t.ps} required>
          <input type="text" placeholder={t.psPlaceholder} {...f('ps')} />
        </Field>
        <Field label={t.ccm} optional>
          <input type="text" placeholder={t.ccmPlaceholder}
            value={data.ccm || ''}
            onChange={e => onChange({ ccm: e.target.value })}
            className={data.ccm ? 'filled' : ''}
          />
        </Field>
        <Field label={t.baujahr} required>
          <input type="text" placeholder={t.baujahrPlaceholder} {...f('baujahr')} />
        </Field>
        <Field label={t.kennzeichen} required full>
          <input type="text" placeholder={t.kennzeichenPlaceholder} {...f('kennzeichen')} />
        </Field>
      </div>

      {/* Kraftstoff */}
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <label style={{
          display: 'block', marginBottom: 10,
          color: attempted && !data.kraftstoff ? '#b91c1c' : '#1a1a2e'
        }}>
          {t.kraftstoff} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={radioStyle('kraftstoff', 'diesel')} onClick={() => onChange({ kraftstoff: 'diesel' })}>⛽ {t.diesel}</div>
          <div style={radioStyle('kraftstoff', 'benzin')} onClick={() => onChange({ kraftstoff: 'benzin' })}>⛽ {t.benzin}</div>
          <div style={radioStyle('kraftstoff', 'elektrisch')} onClick={() => onChange({ kraftstoff: 'elektrisch' })}>⚡ {t.elektrisch}</div>
          <div style={radioStyle('kraftstoff', 'hybrid')} onClick={() => onChange({ kraftstoff: 'hybrid' })}>🔋 {t.hybrid}</div>
        </div>
      </div>

      {/* Türen */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', marginBottom: 10,
          color: attempted && !data.tueren ? '#b91c1c' : '#1a1a2e'
        }}>
          {t.tueren} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={radioStyle('tueren', '3')} onClick={() => onChange({ tueren: '3' })}>🚪 {t.drei}</div>
          <div style={radioStyle('tueren', '5')} onClick={() => onChange({ tueren: '5' })}>🚪 {t.fuenf}</div>
        </div>
      </div>

      {/* Extras */}
      <div style={{ marginBottom: 16 }}>
        <label style={{
          display: 'block', marginBottom: 6,
          color: attempted && !data.extras ? '#b91c1c' : '#1a1a2e'
        }}>
          {t.extras} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{
          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8,
          padding: '10px 14px', fontSize: 13, color: '#92400e', marginBottom: 10,
          display: 'flex', gap: 8,
        }}>
          <span>💡</span><span>{t.extrasHint}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={radioStyle('extras', 'ja')} onClick={() => onChange({ extras: 'ja' })}>✅ {t.ja}</div>
          <div style={radioStyle('extras', 'nein')} onClick={() => onChange({ extras: 'nein' })}>❌ {t.nein}</div>
        </div>
        {data.extras === 'ja' && (
          <Field label={t.extrasInfo} optional full>
            <textarea placeholder={t.extrasPlaceholder} rows={3}
              value={data.extras_info || ''}
              onChange={e => onChange({ extras_info: e.target.value })}
              className={data.extras_info ? 'filled' : ''}
            />
          </Field>
        )}
      </div>

      {/* Private Nutzung */}
      <div style={{ marginBottom: 24 }}>
        <label style={{
          display: 'block', marginBottom: 6,
          color: attempted && !data.privat_nutzung ? '#b91c1c' : '#1a1a2e'
        }}>
          {t.privat} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8,
          padding: '10px 14px', fontSize: 13, color: '#0369a1', marginBottom: 10,
          display: 'flex', gap: 8,
        }}>
          <span>ℹ️</span><span>{t.privatNote}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={radioStyle('privat_nutzung', 'ja')} onClick={() => onChange({ privat_nutzung: 'ja' })}>✅ {t.ja}</div>
          <div style={radioStyle('privat_nutzung', 'nein')} onClick={() => onChange({ privat_nutzung: 'nein' })}>❌ {t.nein}</div>
        </div>
        <Field label={t.privatInfo} optional full>
          <textarea placeholder={t.privatPlaceholder} rows={2}
            value={data.privat_nutzung_info || ''}
            onChange={e => onChange({ privat_nutzung_info: e.target.value })}
            className={data.privat_nutzung_info ? 'filled' : ''}
          />
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
