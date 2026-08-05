import { useState } from 'react';
import Field from '../../components/Field';

const T = {
  de: {
    title: 'Werte',
    subtitle: 'Angaben zu den Versicherungswerten Ihrer Immobilie.',
    infoHint: 'Diese Angaben sind wichtig für die korrekte Berechnung Ihres Versicherungsschutzes. Im Zweifelsfall unterstützt Rita Sie gerne bei der Schätzung.',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    wiederaufbau: 'Wiederaufbauwert des Gebäudes in €',
    wiederaufbauHint: 'Kosten für den vollständigen Wiederaufbau des Gebäudes. Falls ohne Gebäude (z.B. als Mieter/in) bitte „0" schreiben.',
    wiederbeschaffung: 'Wiederbeschaffungswert des Hausrates inkl. Küche in €',
    wiederbeschaffungHint: 'Gesamtwert aller Einrichtungsgegenstände und der Küche',
    wertgegenstaende: 'Wertgegenstände',
    wertgegenstaendeHint: 'z.B. Schmuck 5.000€, Gemälde 3.000€ – bitte einzeln aufführen',
    wertgegenstaendePlaceholder: 'Falls keine Wertgegenstände vorhanden: bitte \'Keine\' eintragen',
    errors: {
      wiederaufbau: 'Wiederaufbauwert des Gebäudes',
      wiederbeschaffung: 'Wiederbeschaffungswert des Hausrates',
      wertgegenstaende: 'Wertgegenstände',
    },
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    back: '← Zurück', next: 'Weiter →',
  },
  en: {
    title: 'Values',
    subtitle: 'Details about the insurance values of your property.',
    infoHint: 'These details are important for correctly calculating your insurance coverage. If in doubt, Rita is happy to help you estimate.',
    errorHeader: '❌ Please fill in all required fields:',
    wiederaufbau: 'Rebuilding value of the building (€)',
    wiederaufbauHint: 'Cost of fully rebuilding the property. If no building (e.g. as a tenant) please write "0".',
    wiederbeschaffung: 'Replacement value of household contents incl. kitchen (€)',
    wiederbeschaffungHint: 'Total value of all furnishings and the kitchen',
    wertgegenstaende: 'Valuables',
    wertgegenstaendeHint: 'e.g. Jewellery €5,000, Paintings €3,000 – please list individually',
    wertgegenstaendePlaceholder: 'If no valuables: please enter \'None\'',
    errors: {
      wiederaufbau: 'Rebuilding value',
      wiederbeschaffung: 'Replacement value of household contents',
      wertgegenstaende: 'Valuables',
    },
    requiredHint: '⚠️ Please fill in all required fields',
    back: '← Back', next: 'Next →',
  },
};

export default function StepHogarWerte({ data, onChange, onNext, onPrev, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

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
      <h2 className="step-title">{t.title}</h2>
      <p className="step-subtitle">{t.subtitle}</p>

      <div style={{
        background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 8,
        padding: '12px 16px', fontSize: 13, color: '#1e40af', marginBottom: 24,
        display: 'flex', gap: 8,
      }}>
        <span>ℹ️</span>
        <span>{t.infoHint}</span>
      </div>

      {attempted && !canNext && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#b91c1c'
        }}>
          {t.errorHeader}<br/>
          <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
            {!data.wiederaufbauwert && <li>{t.errors.wiederaufbau}</li>}
            {!data.wiederbeschaffungswert && <li>{t.errors.wiederbeschaffung}</li>}
            {!data.wertgegenstaende && <li>{t.errors.wertgegenstaende}</li>}
          </ul>
        </div>
      )}

      <div className="form-grid single">
        <Field label={t.wiederaufbau} required>
          <input type="number" placeholder="z.B. 250000" min="0" {...f('wiederaufbauwert')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.wiederaufbauHint}</span>
        </Field>
        <Field label={t.wiederbeschaffung} required>
          <input type="number" placeholder="z.B. 30000" min="0" {...f('wiederbeschaffungswert')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.wiederbeschaffungHint}</span>
        </Field>
        <Field label={t.wertgegenstaende} required>
          <textarea placeholder={t.wertgegenstaendePlaceholder} {...f('wertgegenstaende')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.wertgegenstaendeHint}</span>
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
