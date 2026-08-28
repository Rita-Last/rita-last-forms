import { useState } from 'react';

const T = {
  de: {
    title: 'Zusammenfassung',
    subtitle: 'Bitte prüfen Sie Ihre Angaben vor dem Absenden.',
    personal: 'Persönliche Daten', fahrzeug: 'Fahrzeug-Daten',
    name: 'Name', nie: 'NIE-Nummer', geburtsdatum: 'Geburtsdatum',
    email: 'E-Mail', adresse: 'Adresse', nationalitaet: 'Nationalität',
    fuehrerschein: 'Führerscheindatum', unfallfrei: 'Letzte 5 Jahre unfallfrei',
    unfallfreiInfo: 'Details (Unfallfrei)', fahrer25: 'Fahrer unter 25',
    fahrer25Info: 'Details (Fahrer u. 25)',
    marke: 'Marke', modell: 'Modell', version: 'Version', ps: 'PS',
    kraftstoff: 'Kraftstoff', tueren: 'Türen', baujahr: 'Baujahr',
    kennzeichen: 'Kennzeichen', ccm: 'Hubraum (ccm)',
    extras: 'Extras/Sonderausstattung',
    extrasInfo: 'Details (Extras)', privat: 'Nur private Nutzung',
    privatInfo: 'Details (Nutzung)',
    diesel: 'Diesel', benzin: 'Benzin', elektrisch: 'Elektrisch', hybrid: 'Hybrid',
    drei: '3 Türer', fuenf: '5 Türer',
    ja: 'Ja', nein: 'Nein',
    ccm: 'Hubraum (ccm)',
    dsgvo: 'Ich stimme der Verarbeitung meiner Daten zur Bearbeitung dieser Anfrage zu.',
    dsgvoRequired: '⚠️ Bitte der Datenschutzerklärung zustimmen.',
    submit: 'Anfrage absenden',
    submitting: 'Wird gesendet…',
    back: '← Zurück',
    incomplete: '⚠️ Bitte alle vorherigen Schritte ausfüllen.',
  },
  en: {
    title: 'Summary',
    subtitle: 'Please review your information before submitting.',
    personal: 'Personal Data', fahrzeug: 'Vehicle Data',
    name: 'Name', nie: 'NIE number', geburtsdatum: 'Date of birth',
    email: 'E-Mail', adresse: 'Address', nationalitaet: 'Nationality',
    fuehrerschein: 'Licence date', unfallfrei: 'Last 5 years accident-free',
    unfallfreiInfo: 'Details (accident-free)', fahrer25: 'Driver under 25',
    fahrer25Info: 'Details (driver u. 25)',
    marke: 'Make', modell: 'Model', version: 'Version', ps: 'HP',
    kraftstoff: 'Fuel', tueren: 'Doors', baujahr: 'Year',
    kennzeichen: 'Number plate', ccm: 'Engine displacement (cc)',
    extras: 'Extras / Special equipment',
    extrasInfo: 'Details (extras)', privat: 'Private use only',
    privatInfo: 'Details (usage)',
    diesel: 'Diesel', benzin: 'Petrol', elektrisch: 'Electric', hybrid: 'Hybrid',
    drei: '3 doors', fuenf: '5 doors',
    ja: 'Yes', nein: 'No',
    ccm: 'Engine displacement (cc)',
    dsgvo: 'I agree to the processing of my data to handle this enquiry.',
    dsgvoRequired: '⚠️ Please accept the data protection declaration.',
    submit: 'Submit request',
    submitting: 'Sending…',
    back: '← Back',
    incomplete: '⚠️ Please fill in all previous steps.',
  },
};

function Row({ label, value }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: '5px 10px', fontWeight: 600, whiteSpace: 'nowrap', color: '#374151', fontSize: 13 }}>{label}:</td>
      <td style={{ padding: '5px 10px', color: '#1f2937', fontSize: 13 }}>{value}</td>
    </tr>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ color: '#9B2035', marginBottom: 10, fontSize: 16 }}>{icon} {title}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function StepAutoSummary({
  formData, onPrev, onSubmit, submitError, submitting,
  datenschutz, onDatenschutz, lang = 'de',
}) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;
  const { personal, fahrzeug } = formData;

  const kraftstoffMap = { diesel: t.diesel, benzin: t.benzin, elektrisch: t.elektrisch, hybrid: t.hybrid };
  const kraftstoffLabel = kraftstoffMap[fahrzeug?.kraftstoff] || fahrzeug?.kraftstoff || '';
  const tuerenLabel = fahrzeug?.tueren === '3' ? t.drei : fahrzeug?.tueren === '5' ? t.fuenf : fahrzeug?.tueren || '';
  const jaNein = (val) => val === 'ja' ? t.ja : val === 'nein' ? t.nein : val || '';

  const adresse = [personal?.strasse, personal?.plz, personal?.ort].filter(Boolean).join(', ');

  const handleSubmit = () => {
    if (!datenschutz) {
      setAttempted(true);
      return;
    }
    onSubmit();
  };

  return (
    <div>
      <h2 className="step-title">{t.title}</h2>
      <p className="step-subtitle">{t.subtitle}</p>

      <Section title={t.personal} icon="👤">
        <Row label={t.name} value={`${personal?.vorname || ''} ${personal?.nachname || ''}`.trim()} />
        <Row label={t.nie} value={personal?.nie} />
        <Row label={t.geburtsdatum} value={personal?.geburtsdatum} />
        <Row label={t.nationalitaet} value={personal?.nationalitaet} />
        <Row label={t.email} value={personal?.email} />
        <Row label={t.adresse} value={adresse} />
        <Row label={t.fuehrerschein} value={personal?.fuehrerschein_datum} />
        <Row label={t.unfallfrei} value={jaNein(personal?.unfallfrei)} />
        {personal?.unfallfrei_info && <Row label={t.unfallfreiInfo} value={personal.unfallfrei_info} />}
        <Row label={t.fahrer25} value={jaNein(personal?.fahrer_unter_25)} />
        {personal?.fahrer_unter_25_info && <Row label={t.fahrer25Info} value={personal.fahrer_unter_25_info} />}
      </Section>

      <Section title={t.fahrzeug} icon="🚗">
        <Row label={t.marke} value={fahrzeug?.marke} />
        <Row label={t.modell} value={fahrzeug?.modell} />
        <Row label={t.version} value={fahrzeug?.version} />
        <Row label={t.ps} value={fahrzeug?.ps} />
        <Row label={t.ccm} value={fahrzeug?.ccm} />
        <Row label={t.kraftstoff} value={kraftstoffLabel} />
        <Row label={t.tueren} value={tuerenLabel} />
        <Row label={t.baujahr} value={fahrzeug?.baujahr} />
        <Row label={t.kennzeichen} value={fahrzeug?.kennzeichen} />
        <Row label={t.extras} value={jaNein(fahrzeug?.extras)} />
        {fahrzeug?.extras_info && <Row label={t.extrasInfo} value={fahrzeug.extras_info} />}
        <Row label={t.privat} value={jaNein(fahrzeug?.privat_nutzung)} />
        {fahrzeug?.privat_nutzung_info && <Row label={t.privatInfo} value={fahrzeug.privat_nutzung_info} />}
      </Section>

      {/* DSGVO */}
      <div style={{
        background: '#f9fafb', border: `1px solid ${attempted && !datenschutz ? '#ef4444' : '#e5e7eb'}`,
        borderRadius: 8, padding: '14px 16px', marginBottom: 20,
      }}>
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: 13, width: '100%' }}>
          <input
            type="checkbox"
            checked={datenschutz}
            onChange={e => onDatenschutz(e.target.checked)}
            style={{ marginTop: 2, accentColor: '#9B2035', flexShrink: 0 }}
          />
          <span style={{ color: attempted && !datenschutz ? '#b91c1c' : '#374151', flex: 1 }}>{t.dsgvo}</span>
        </label>
        {attempted && !datenschutz && (
          <div style={{ color: '#b91c1c', fontSize: 12, marginTop: 6 }}>{t.dsgvoRequired}</div>
        )}
      </div>

      {submitError && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8,
          padding: '12px 16px', marginBottom: 16, fontSize: 14, color: '#b91c1c'
        }}>
          ❌ {submitError}
        </div>
      )}

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>{t.back}</button>
        <button
          className="btn btn-hogar"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  );
}
