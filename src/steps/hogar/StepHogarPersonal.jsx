import { useState } from 'react';
import Field from '../../components/Field';

const T = {
  de: {
    title: 'Persönliche Daten & Adresse',
    subtitle: 'Bitte geben Sie Ihre persönlichen Kontaktdaten ein.',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    fields: {
      vorname: 'Vorname', nachname: 'Nachname', nie: 'NIE-Nummer',
      geburtsdatum: 'Geburtsdatum', email: 'E-Mail', plz: 'PLZ', ort: 'Ort / Gemeinde',
    },
    nieHint: 'Número de Identificación de Extranjero',
    adresseDivider: 'Adresse der Immobilie',
    strasse: 'Straße & Hausnummer', straPlaceholder: 'Calle Mayor 1',
    plz: 'PLZ', ort: 'Ort / Gemeinde',
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    next: 'Weiter →',
  },
  en: {
    title: 'Personal Data & Address',
    subtitle: 'Please enter your personal contact details.',
    errorHeader: '❌ Please fill in all required fields:',
    fields: {
      vorname: 'First name', nachname: 'Last name', nie: 'NIE number',
      geburtsdatum: 'Date of birth', email: 'E-mail', plz: 'Postal code', ort: 'City / Municipality',
    },
    nieHint: 'Número de Identificación de Extranjero',
    adresseDivider: 'Property Address',
    strasse: 'Street & House number', straPlaceholder: 'Calle Mayor 1',
    plz: 'Postal code', ort: 'City / Municipality',
    requiredHint: '⚠️ Please fill in all required fields',
    next: 'Next →',
  },
};

export default function StepHogarPersonal({ data, adresse, onChange, onChangeAdresse, onNext, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

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
      <h2 className="step-title">{t.title}</h2>
      <p className="step-subtitle">{t.subtitle}</p>

      {attempted && !canNext && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#b91c1c'
        }}>
          {t.errorHeader}<br/>
          <ul style={{margin: '8px 0 0', paddingLeft: 20}}>
            {!data.vorname && <li>{t.fields.vorname}</li>}
            {!data.nachname && <li>{t.fields.nachname}</li>}
            {!data.nie && <li>{t.fields.nie}</li>}
            {!data.geburtsdatum && <li>{t.fields.geburtsdatum}</li>}
            {!data.email && <li>{t.fields.email}</li>}
            {!adresse.plz && <li>{t.fields.plz}</li>}
            {!adresse.ort && <li>{t.fields.ort}</li>}
          </ul>
        </div>
      )}

      <div className="form-grid">
        <Field label={t.fields.vorname} required>
          <input type="text" placeholder="Max" {...f('vorname')} />
        </Field>
        <Field label={t.fields.nachname} required>
          <input type="text" placeholder="Mustermann" {...f('nachname')} />
        </Field>
        <Field label={t.fields.nie} required>
          <input type="text" placeholder="X1234567A" {...f('nie')} />
          <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.nieHint}</span>
        </Field>
        <Field label={t.fields.geburtsdatum} required>
          <input type="date" {...f('geburtsdatum')} />
        </Field>
        <Field label={t.fields.email} required full>
          <input type="email" placeholder="name@example.com" {...f('email')} />
        </Field>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 16px', color: '#6b7280' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{t.adresseDivider}</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e5e7eb' }} />
      </div>

      <div className="form-grid">
        <Field label={t.strasse} optional full>
          <input type="text" placeholder={t.straPlaceholder} {...fa('strasse')} />
        </Field>
        <Field label={t.plz} required>
          <input type="text" placeholder="28001" {...fa('plz')} />
        </Field>
        <Field label={t.ort} required>
          <input type="text" placeholder="Madrid" {...fa('ort')} />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 'auto' }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>{t.requiredHint}</span>
          )}
          <button className="btn btn-hogar" onClick={handleNext}>{t.next}</button>
        </div>
      </div>
    </div>
  );
}
