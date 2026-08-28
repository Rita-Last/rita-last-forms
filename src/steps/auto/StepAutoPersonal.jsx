import { useState } from 'react';
import Field from '../../components/Field';

const T = {
  de: {
    title: 'Persönliche Daten',
    subtitle: 'Policen-Nehmer, Eigentümer und Hauptfahrer sollten dieselbe Person sein. Bitte vollständigen Namen angeben, und mindestens Wohnort mit Postleitzahl.',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    vorname: 'Vorname', nachname: 'Nachname', nie: 'NIE-Nummer',
    geburtsdatum: 'Geburtsdatum', email: 'E-Mail', telefon: 'Telefon / Mobil',
    strasse: 'Straße & Hausnummer', plz: 'Postleitzahl', ort: 'Wohnort',
    nationalitaet: 'Nationalität',
    fuehrerschein: 'Führerscheindatum (Erstausstellungsdatum)',
    unfallfrei: 'Letzte 5 Jahre unfallfrei? (Schadensfreiheitsrabatt)',
    unfallfreiInfo: 'Zusätzliche Infos (optional)',
    unfallfreiPlaceholder: 'z.B. 1 Schaden vor 3 Jahren',
    fahrer25: 'Fahrer unter 25 Jahre?',
    fahrer25Info: 'Zusätzliche Infos (optional)',
    fahrer25Placeholder: 'z.B. Sohn, 22 Jahre, gelegentlicher Fahrer',
    ja: 'Ja', nein: 'Nein',
    errors: {
      vorname: 'Vorname', nachname: 'Nachname', nie: 'NIE-Nummer',
      geburtsdatum: 'Geburtsdatum', email: 'E-Mail',
      plz: 'Postleitzahl', ort: 'Wohnort', nationalitaet: 'Nationalität',
      fuehrerschein: 'Führerscheindatum', unfallfrei: 'Letzte 5 Jahre unfallfrei (Ja/Nein)',
      fahrer25: 'Fahrer unter 25 Jahre (Ja/Nein)',
    },
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    next: 'Weiter →',
  },
  en: {
    title: 'Personal Data',
    subtitle: 'The policyholder, owner and main driver should be the same person. Please enter full name, and at least city and postcode.',
    errorHeader: '❌ Please fill in all required fields:',
    vorname: 'First name', nachname: 'Last name', nie: 'NIE number',
    geburtsdatum: 'Date of birth', email: 'E-Mail', telefon: 'Phone / Mobile',
    strasse: 'Street & house number', plz: 'Postcode', ort: 'City',
    nationalitaet: 'Nationality',
    fuehrerschein: 'Driver\'s licence date (date first issued)',
    unfallfrei: 'Last 5 years accident-free? (No-claims bonus)',
    unfallfreiInfo: 'Additional info (optional)',
    unfallfreiPlaceholder: 'e.g. 1 claim 3 years ago',
    fahrer25: 'Driver under 25 years old?',
    fahrer25Info: 'Additional info (optional)',
    fahrer25Placeholder: 'e.g. Son, 22 years old, occasional driver',
    ja: 'Yes', nein: 'No',
    errors: {
      vorname: 'First name', nachname: 'Last name', nie: 'NIE number',
      geburtsdatum: 'Date of birth', email: 'E-Mail',
      plz: 'Postcode', ort: 'City', nationalitaet: 'Nationality',
      fuehrerschein: 'Driver\'s licence date', unfallfrei: 'Last 5 years accident-free (Yes/No)',
      fahrer25: 'Driver under 25 (Yes/No)',
    },
    requiredHint: '⚠️ Please fill in all required fields',
    next: 'Next →',
  },
};

export default function StepAutoPersonal({ data, onChange, onNext, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

  const f = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: attempted && !data[field] ? 'field-error' : data[field] ? 'filled' : '',
  });

  const fOpt = (field) => ({
    value: data[field] || '',
    onChange: e => onChange({ [field]: e.target.value }),
    className: data[field] ? 'filled' : '',
  });

  const requiredFields = ['vorname', 'nachname', 'nie', 'geburtsdatum', 'email', 'plz', 'ort', 'nationalitaet', 'fuehrerschein_datum'];
  const radioFields = ['unfallfrei', 'fahrer_unter_25'];

  const canNext =
    requiredFields.every(f => data[f]) &&
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
    !data.vorname && t.errors.vorname,
    !data.nachname && t.errors.nachname,
    !data.nie && t.errors.nie,
    !data.geburtsdatum && t.errors.geburtsdatum,
    !data.email && t.errors.email,
    !data.plz && t.errors.plz,
    !data.ort && t.errors.ort,
    !data.nationalitaet && t.errors.nationalitaet,
    !data.fuehrerschein_datum && t.errors.fuehrerschein,
    !data.unfallfrei && t.errors.unfallfrei,
    !data.fahrer_unter_25 && t.errors.fahrer25,
  ].filter(Boolean) : [];

  const radioStyle = (field, val) => ({
    border: `2px solid ${data[field] === val ? '#cc0000' : attempted && !data[field] ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 10,
    padding: '10px 18px',
    cursor: 'pointer',
    background: data[field] === val ? '#fff5f5' : attempted && !data[field] ? '#fef2f2' : 'white',
    color: data[field] === val ? '#cc0000' : '#374151',
    fontWeight: data[field] === val ? 700 : 400,
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
        <Field label={t.vorname} required>
          <input type="text" {...f('vorname')} />
        </Field>
        <Field label={t.nachname} required>
          <input type="text" {...f('nachname')} />
        </Field>
        <Field label={t.nie} required>
          <input type="text" placeholder="z.B. X1234567A" {...f('nie')} />
        </Field>
        <Field label={t.geburtsdatum} required>
          <input type="date" {...f('geburtsdatum')} />
        </Field>
        <Field label={t.email} required full>
          <input type="email" {...f('email')} />
        </Field>
        <Field label={t.telefon} optional>
          <input type="tel" placeholder="+34 6xx xxx xxx" {...fOpt('telefon')} />
        </Field>
        <Field label={t.strasse} optional full>
          <input type="text" {...fOpt('strasse')} />
        </Field>
        <Field label={t.plz} required>
          <input type="text" placeholder="z.B. 07181" {...f('plz')} />
        </Field>
        <Field label={t.ort} required>
          <input type="text" {...f('ort')} />
        </Field>
        <Field label={t.nationalitaet} required>
          <input type="text" {...f('nationalitaet')} />
        </Field>
        <Field label={t.fuehrerschein} required full>
          <input type="date" {...f('fuehrerschein_datum')} />
        </Field>
      </div>

      {/* Unfallfrei */}
      <div style={{ marginTop: 20, marginBottom: 16 }}>
        <label style={{
          fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10,
          color: attempted && !data.unfallfrei ? '#b91c1c' : '#374151'
        }}>
          {t.unfallfrei} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={radioStyle('unfallfrei', 'ja')} onClick={() => onChange({ unfallfrei: 'ja' })}>✅ {t.ja}</div>
          <div style={radioStyle('unfallfrei', 'nein')} onClick={() => onChange({ unfallfrei: 'nein' })}>❌ {t.nein}</div>
        </div>
        <Field label={t.unfallfreiInfo} optional full>
          <textarea placeholder={t.unfallfreiPlaceholder} rows={2}
            value={data.unfallfrei_info || ''}
            onChange={e => onChange({ unfallfrei_info: e.target.value })}
            className={data.unfallfrei_info ? 'filled' : ''}
          />
        </Field>
      </div>

      {/* Fahrer unter 25 */}
      <div style={{ marginBottom: 24 }}>
        <label style={{
          fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 10,
          color: attempted && !data.fahrer_unter_25 ? '#b91c1c' : '#374151'
        }}>
          {t.fahrer25} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <div style={radioStyle('fahrer_unter_25', 'ja')} onClick={() => onChange({ fahrer_unter_25: 'ja' })}>✅ {t.ja}</div>
          <div style={radioStyle('fahrer_unter_25', 'nein')} onClick={() => onChange({ fahrer_unter_25: 'nein' })}>❌ {t.nein}</div>
        </div>
        <Field label={t.fahrer25Info} optional full>
          <textarea placeholder={t.fahrer25Placeholder} rows={2}
            value={data.fahrer_unter_25_info || ''}
            onChange={e => onChange({ fahrer_unter_25_info: e.target.value })}
            className={data.fahrer_unter_25_info ? 'filled' : ''}
          />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <div />
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
