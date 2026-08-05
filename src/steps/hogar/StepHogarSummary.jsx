const T = {
  de: {
    title: 'Zusammenfassung',
    subtitle: 'Bitte prüfen Sie Ihre Angaben vor dem Absenden.',
    sections: {
      personal: 'Persönliche Daten', adresse: 'Adresse der Immobilie',
      objekt: 'Objekt-Details', nutzung: 'Nutzung', werte: 'Werte',
    },
    labels: {
      vorname: 'Vorname', nachname: 'Nachname', nie: 'NIE-Nummer',
      geburtsdatum: 'Geburtsdatum', email: 'E-Mail',
      strasse: 'Straße & Hausnummer', plz: 'PLZ', ort: 'Ort',
      objekttyp: 'Objekttyp', lage: 'Lage', hausart: 'Hausart',
      baujahr: 'Baujahr', saniert: 'Komplett saniert', saniertJahr: 'Jahr der Sanierung',
      kataster: 'Kataster-Nummer', bebaute: 'Bebaute Fläche', weitere: 'Weitere Nutzflächen',
      rolle: 'Rolle', nutzungsart: 'Nutzungsart', wohnsitz: 'Wohnsitzart', vermietung: 'Vermietungsart',
      wiederaufbau: 'Wiederaufbauwert', wiederbeschaffung: 'Wiederbeschaffungswert', wertgegenstaende: 'Wertgegenstände',
    },
    ja: 'Ja', nein: 'Nein',
    missingHeader: 'Folgende Pflichtfelder fehlen noch:',
    missingFields: {
      rolle: 'Eigentümer/in oder Mieter/in', art: 'Art der Eigentumsnutzung',
      wohnsitz: 'Wohnsitzart', vermietung: 'Vermietungsart',
      bebaute: 'Bebaute Fläche', weitere: 'Weitere Nutzflächen',
      wiederaufbau: 'Wiederaufbauwert', wiederbeschaffung: 'Wiederbeschaffungswert', wertgegenstaende: 'Wertgegenstände',
      vorname: 'Vorname', nachname: 'Nachname', nie: 'NIE-Nummer', geburtsdatum: 'Geburtsdatum',
      email: 'E-Mail', plz: 'PLZ', ort: 'Ort', objekttyp: 'Objekttyp', baujahr: 'Baujahr',
      saniert: 'Sanierung (Ja/Nein)', saniertJahr: 'Jahr der Sanierung',
      lage: 'Lage der Wohnung', hausart: 'Hausart',
    },
    dsgvo: {
      label: 'Datenschutz-Einwilligung (Pflichtfeld): ',
      text: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten durch Rita Last Versicherungen zur Bearbeitung meiner Angebotsanfrage zu. Die Daten werden ausschließlich für die Angebotserstellung verwendet und nicht an Dritte weitergegeben. Weitere Informationen finden Sie in der ',
      link: 'Datenschutzerklärung',
      warning: '⚠️ Bitte Einwilligung bestätigen um die Anfrage absenden zu können.',
    },
    back: '← Zurück', submit: 'Anfrage absenden ✓', submitting: 'Wird gesendet...',
  },
  en: {
    title: 'Summary',
    subtitle: 'Please review your details before submitting.',
    sections: {
      personal: 'Personal Data', adresse: 'Property Address',
      objekt: 'Property Details', nutzung: 'Usage', werte: 'Values',
    },
    labels: {
      vorname: 'First name', nachname: 'Last name', nie: 'NIE number',
      geburtsdatum: 'Date of birth', email: 'E-mail',
      strasse: 'Street & House number', plz: 'Postal code', ort: 'City',
      objekttyp: 'Property type', lage: 'Location', hausart: 'House type',
      baujahr: 'Year of construction', saniert: 'Fully renovated', saniertJahr: 'Year of renovation',
      kataster: 'Cadastre number', bebaute: 'Built-up area', weitere: 'Additional usable areas',
      rolle: 'Role', nutzungsart: 'Usage type', wohnsitz: 'Residence type', vermietung: 'Rental type',
      wiederaufbau: 'Rebuilding value', wiederbeschaffung: 'Replacement value', wertgegenstaende: 'Valuables',
    },
    ja: 'Yes', nein: 'No',
    missingHeader: 'The following required fields are still missing:',
    missingFields: {
      rolle: 'Owner or Tenant', art: 'Type of ownership use',
      wohnsitz: 'Residence type', vermietung: 'Rental type',
      bebaute: 'Built-up area', weitere: 'Additional usable areas',
      wiederaufbau: 'Rebuilding value', wiederbeschaffung: 'Replacement value of household contents', wertgegenstaende: 'Valuables',
      vorname: 'First name', nachname: 'Last name', nie: 'NIE number', geburtsdatum: 'Date of birth',
      email: 'E-mail', plz: 'Postal code', ort: 'City', objekttyp: 'Property type', baujahr: 'Year of construction',
      saniert: 'Renovation (Yes/No)', saniertJahr: 'Year of renovation',
      lage: 'Apartment location', hausart: 'House type',
    },
    dsgvo: {
      label: 'Privacy consent (required): ',
      text: 'I consent to the processing of my personal data by Rita Last Versicherungen for the purpose of processing my quote request. The data will be used exclusively for preparing the quote and will not be passed on to third parties. For more information please see the ',
      link: 'Privacy Policy',
      warning: '⚠️ Please confirm consent to submit the request.',
    },
    back: '← Back', submit: 'Submit request ✓', submitting: 'Sending...',
  },
};

const OBJEKT_TYP_LABELS = { de: { wohnung: 'Wohnung', haus: 'Haus' }, en: { wohnung: 'Apartment', haus: 'House' } };
const LAGE_LABELS = { de: { erdgeschoss: 'Erdgeschoss', obergeschoss: 'Obergeschoss', mittelgeschoss: 'Mittelgeschoss' }, en: { erdgeschoss: 'Ground floor', obergeschoss: 'Upper floor', mittelgeschoss: 'Middle floor' } };
const HAUSART_LABELS = { de: { reihenhaus: 'Reihenhaus', alleinstehendes_haus: 'Alleinstehendes Haus' }, en: { reihenhaus: 'Terraced house', alleinstehendes_haus: 'Detached house' } };
const ROLLE_LABELS = { de: { eigentuemer: 'Eigentümer/in', mieter: 'Mieter/in' }, en: { eigentuemer: 'Owner', mieter: 'Tenant' } };
const NUTZUNG_LABELS = { de: { eigennutzung: 'Eigentum mit Eigennutzung', vermietet: 'Eigentum mit Vermietung' }, en: { eigennutzung: 'Owner-occupied', vermietet: 'Rented out' } };
const WOHNSITZ_LABELS = { de: { hauptwohnsitz: 'Hauptwohnsitz', nebenwohnsitz: 'Nebenwohnsitz' }, en: { hauptwohnsitz: 'Primary residence', nebenwohnsitz: 'Secondary residence' } };
const VERMIETUNG_LABELS = { de: { langzeit: 'Langzeitvermietung', saisonal: 'Saisonale Vermietung', touristisch: 'Touristische Vermietung' }, en: { langzeit: 'Long-term rental', saisonal: 'Seasonal rental', touristisch: 'Tourist rental' } };

function SummarySection({ title, icon, children }) {
  return (
    <div className="summary-section">
      <div className="summary-section-title">
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      <span className="summary-value">{value || <span style={{ color: '#d1d5db' }}>–</span>}</span>
    </div>
  );
}

function getMissingFields(formData, t) {
  const { personal, adresse, objekt, nutzung, flaechen, werte } = formData;
  const missing = [];
  const m = t.missingFields;

  if (!personal.vorname) missing.push(m.vorname);
  if (!personal.nachname) missing.push(m.nachname);
  if (!personal.nie) missing.push(m.nie);
  if (!personal.geburtsdatum) missing.push(m.geburtsdatum);
  if (!personal.email) missing.push(m.email);
  if (!adresse.plz) missing.push(m.plz);
  if (!adresse.ort) missing.push(m.ort);
  if (!objekt.typ) missing.push(m.objekttyp);
  if (objekt.typ === 'wohnung' && !objekt.wohnung_lage) missing.push(m.lage);
  if (objekt.typ === 'haus' && !objekt.haus_art) missing.push(m.hausart);
  if (!objekt.baujahr) missing.push(m.baujahr);
  if (!objekt.saniert) missing.push(m.saniert);
  if (objekt.saniert === 'ja' && !objekt.saniert_jahr) missing.push(m.saniertJahr);
  if (!flaechen.bebaute_flaeche) missing.push(m.bebaute);
  if (!flaechen.weitere_flaechen) missing.push(m.weitere);
  if (!nutzung.rolle) missing.push(m.rolle);
  if (nutzung.rolle === 'eigentuemer') {
    if (!nutzung.art) missing.push(m.art);
    if (nutzung.art === 'eigennutzung' && !nutzung.eigennutzung_typ) missing.push(m.wohnsitz);
    if (nutzung.art === 'vermietet' && !nutzung.vermietung_typ) missing.push(m.vermietung);
  }
  if (nutzung.rolle === 'mieter' && !nutzung.mieter_typ) missing.push(m.wohnsitz);
  if (!werte.wiederaufbauwert) missing.push(m.wiederaufbau);
  if (!werte.wiederbeschaffungswert) missing.push(m.wiederbeschaffung);
  if (!werte.wertgegenstaende) missing.push(m.wertgegenstaende);

  return missing;
}

export default function StepHogarSummary({ formData, onPrev, onSubmit, submitError, submitting, datenschutz, onDatenschutz, lang = 'de' }) {
  const { personal, adresse, objekt, nutzung, flaechen, werte } = formData;
  const t = T[lang] || T.de;
  const missing = getMissingFields(formData, t);
  const isComplete = missing.length === 0;

  const l = lang === 'en' ? 'en' : 'de';

  return (
    <div>
      <h2 className="step-title">{t.title}</h2>
      <p className="step-subtitle">{t.subtitle}</p>

      <SummarySection title={t.sections.personal} icon="👤">
        <SummaryRow label={t.labels.vorname} value={personal.vorname} />
        <SummaryRow label={t.labels.nachname} value={personal.nachname} />
        <SummaryRow label={t.labels.nie} value={personal.nie} />
        <SummaryRow label={t.labels.geburtsdatum} value={personal.geburtsdatum} />
        <SummaryRow label={t.labels.email} value={personal.email} />
      </SummarySection>

      <SummarySection title={t.sections.adresse} icon="📍">
        <SummaryRow label={t.labels.strasse} value={adresse.strasse} />
        <SummaryRow label={t.labels.plz} value={adresse.plz} />
        <SummaryRow label={t.labels.ort} value={adresse.ort} />
      </SummarySection>

      <SummarySection title={t.sections.objekt} icon="🏠">
        <SummaryRow label={t.labels.objekttyp} value={OBJEKT_TYP_LABELS[l][objekt.typ]} />
        {objekt.typ === 'wohnung' && <SummaryRow label={t.labels.lage} value={LAGE_LABELS[l][objekt.wohnung_lage]} />}
        {objekt.typ === 'haus' && <SummaryRow label={t.labels.hausart} value={HAUSART_LABELS[l][objekt.haus_art]} />}
        <SummaryRow label={t.labels.baujahr} value={objekt.baujahr} />
        <SummaryRow label={t.labels.saniert} value={objekt.saniert === 'ja' ? t.ja : objekt.saniert === 'nein' ? t.nein : ''} />
        {objekt.saniert === 'ja' && <SummaryRow label={t.labels.saniertJahr} value={objekt.saniert_jahr} />}
        <SummaryRow label={t.labels.kataster} value={objekt.kataster} />
        <SummaryRow label={t.labels.bebaute} value={flaechen.bebaute_flaeche ? `${flaechen.bebaute_flaeche} m²` : ''} />
        <SummaryRow label={t.labels.weitere} value={flaechen.weitere_flaechen} />
      </SummarySection>

      <SummarySection title={t.sections.nutzung} icon="🏡">
        <SummaryRow label={t.labels.rolle} value={ROLLE_LABELS[l][nutzung.rolle]} />
        {nutzung.rolle === 'eigentuemer' && <SummaryRow label={t.labels.nutzungsart} value={NUTZUNG_LABELS[l][nutzung.art]} />}
        {nutzung.rolle === 'eigentuemer' && nutzung.art === 'eigennutzung' && <SummaryRow label={t.labels.wohnsitz} value={WOHNSITZ_LABELS[l][nutzung.eigennutzung_typ]} />}
        {nutzung.rolle === 'eigentuemer' && nutzung.art === 'vermietet' && <SummaryRow label={t.labels.vermietung} value={VERMIETUNG_LABELS[l][nutzung.vermietung_typ]} />}
        {nutzung.rolle === 'mieter' && <SummaryRow label={t.labels.wohnsitz} value={WOHNSITZ_LABELS[l][nutzung.mieter_typ]} />}
      </SummarySection>

      <SummarySection title={t.sections.werte} icon="💰">
        <SummaryRow label={t.labels.wiederaufbau} value={werte.wiederaufbauwert ? `${Number(werte.wiederaufbauwert).toLocaleString('de-DE')} €` : ''} />
        <SummaryRow label={t.labels.wiederbeschaffung} value={werte.wiederbeschaffungswert ? `${Number(werte.wiederbeschaffungswert).toLocaleString('de-DE')} €` : ''} />
        <SummaryRow label={t.labels.wertgegenstaende} value={werte.wertgegenstaende} />
      </SummarySection>

      {!isComplete && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
          padding: '14px 16px', marginBottom: 20,
        }}>
          <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8, fontSize: 14 }}>
            {t.missingHeader}
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#dc2626', fontSize: 13 }}>
            {missing.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      {submitError && (
        <div className="error-message">{submitError}</div>
      )}

      <div style={{ background: '#fdf8f9', border: `1px solid ${datenschutz ? '#C8102E' : '#e0e0e8'}`, borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!datenschutz}
            onChange={e => onDatenschutz(e.target.checked)}
            style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, accentColor: '#C8102E', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: '#1a1a2e', lineHeight: 1.5 }}>
            <strong>{t.dsgvo.label}</strong>
            {t.dsgvo.text}
            <a href="https://www.rita-last.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C8102E' }}>{t.dsgvo.link}</a>.
            {!datenschutz && <span style={{ display: 'block', color: '#C8102E', marginTop: 4, fontSize: 12 }}>{t.dsgvo.warning}</span>}
          </span>
        </label>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>{t.back}</button>
        <button
          className="btn btn-hogar"
          onClick={onSubmit}
          disabled={!isComplete || !datenschutz || submitting}
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  );
}
