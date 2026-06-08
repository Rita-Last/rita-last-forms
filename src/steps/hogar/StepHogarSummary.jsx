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

function getMissingFields(formData) {
  const { personal, adresse, objekt, nutzung, flaechen, werte } = formData;
  const missing = [];

  if (!personal.vorname) missing.push('Vorname');
  if (!personal.nachname) missing.push('Nachname');
  if (!personal.nie) missing.push('NIE-Nummer');
  if (!personal.geburtsdatum) missing.push('Geburtsdatum');
  if (!personal.email) missing.push('E-Mail');
  if (!adresse.plz) missing.push('PLZ');
  if (!adresse.ort) missing.push('Ort');
  if (!objekt.typ) missing.push('Objekttyp');
  if (objekt.typ === 'wohnung' && !objekt.wohnung_lage) missing.push('Lage der Wohnung');
  if (objekt.typ === 'haus' && !objekt.haus_art) missing.push('Hausart');
  if (!objekt.baujahr) missing.push('Baujahr');
  if (!objekt.saniert) missing.push('Sanierung (Ja/Nein)');
  if (objekt.saniert === 'ja' && !objekt.saniert_jahr) missing.push('Jahr der Sanierung');
  if (!nutzung.art) missing.push('Nutzungsart');
  if (nutzung.art === 'eigennutzung' && !nutzung.eigennutzung_typ) missing.push('Eigennutzungstyp');
  if (nutzung.art === 'vermietet' && !nutzung.vermietung_typ) missing.push('Vermietungstyp');
  if (!flaechen.bebaute_flaeche) missing.push('Bebaute Fläche');
  if (!flaechen.weitere_flaechen) missing.push('Weitere Nutzflächen');
  if (!werte.wiederaufbauwert) missing.push('Wiederaufbauwert');
  if (!werte.wiederbeschaffungswert) missing.push('Wiederbeschaffungswert');
  if (!werte.wertgegenstaende) missing.push('Wertgegenstände');

  return missing;
}

const OBJEKT_TYP_LABELS = { wohnung: 'Wohnung', haus: 'Haus' };
const LAGE_LABELS = { erdgeschoss: 'Erdgeschoss', obergeschoss: 'Obergeschoss', mittelgeschoss: 'Mittelgeschoss' };
const HAUSART_LABELS = { reihenhaus: 'Reihenhaus', alleinstehendes_haus: 'Alleinstehendes Haus' };
const NUTZUNG_LABELS = { eigennutzung: 'Eigennutzung', vermietet: 'Vermietet' };
const EIGENNUTZUNG_LABELS = { hauptwohnsitz: 'Hauptwohnsitz', nebenwohnsitz: 'Nebenwohnsitz' };
const VERMIETUNG_LABELS = { langzeit: 'Langzeitvermietung', saisonal: 'Saisonale Vermietung', touristisch: 'Touristische Vermietung' };

export default function StepHogarSummary({ formData, onPrev, onSubmit, submitError, submitting, datenschutz, onDatenschutz }) {
  const { personal, adresse, objekt, nutzung, flaechen, werte } = formData;
  const missing = getMissingFields(formData);
  const isComplete = missing.length === 0;

  return (
    <div>
      <h2 className="step-title">Zusammenfassung</h2>
      <p className="step-subtitle">Bitte prüfen Sie Ihre Angaben vor dem Absenden.</p>

      <SummarySection title="Persönliche Daten" icon="👤">
        <SummaryRow label="Vorname" value={personal.vorname} />
        <SummaryRow label="Nachname" value={personal.nachname} />
        <SummaryRow label="NIE-Nummer" value={personal.nie} />
        <SummaryRow label="Geburtsdatum" value={personal.geburtsdatum} />
        <SummaryRow label="E-Mail" value={personal.email} />
      </SummarySection>

      <SummarySection title="Adresse der Immobilie" icon="📍">
        <SummaryRow label="Straße & Hausnummer" value={adresse.strasse} />
        <SummaryRow label="PLZ" value={adresse.plz} />
        <SummaryRow label="Ort" value={adresse.ort} />
      </SummarySection>

      <SummarySection title="Objekt-Details" icon="🏠">
        <SummaryRow label="Objekttyp" value={OBJEKT_TYP_LABELS[objekt.typ]} />
        {objekt.typ === 'wohnung' && <SummaryRow label="Lage" value={LAGE_LABELS[objekt.wohnung_lage]} />}
        {objekt.typ === 'haus' && <SummaryRow label="Hausart" value={HAUSART_LABELS[objekt.haus_art]} />}
        <SummaryRow label="Baujahr" value={objekt.baujahr} />
        <SummaryRow label="Komplett saniert" value={objekt.saniert === 'ja' ? 'Ja' : objekt.saniert === 'nein' ? 'Nein' : ''} />
        {objekt.saniert === 'ja' && <SummaryRow label="Jahr der Sanierung" value={objekt.saniert_jahr} />}
        <SummaryRow label="Kataster-Nummer" value={objekt.kataster} />
      </SummarySection>

      <SummarySection title="Nutzung & Flächen" icon="🏡">
        <SummaryRow label="Nutzungsart" value={NUTZUNG_LABELS[nutzung.art]} />
        {nutzung.art === 'eigennutzung' && <SummaryRow label="Eigennutzungstyp" value={EIGENNUTZUNG_LABELS[nutzung.eigennutzung_typ]} />}
        {nutzung.art === 'vermietet' && <SummaryRow label="Vermietungstyp" value={VERMIETUNG_LABELS[nutzung.vermietung_typ]} />}
        <SummaryRow label="Bebaute Fläche" value={flaechen.bebaute_flaeche ? `${flaechen.bebaute_flaeche} m²` : ''} />
        <SummaryRow label="Weitere Nutzflächen" value={flaechen.weitere_flaechen} />
      </SummarySection>

      <SummarySection title="Werte" icon="💰">
        <SummaryRow label="Wiederaufbauwert" value={werte.wiederaufbauwert ? `${Number(werte.wiederaufbauwert).toLocaleString('de-DE')} €` : ''} />
        <SummaryRow label="Wiederbeschaffungswert" value={werte.wiederbeschaffungswert ? `${Number(werte.wiederbeschaffungswert).toLocaleString('de-DE')} €` : ''} />
        <SummaryRow label="Wertgegenstände" value={werte.wertgegenstaende} />
      </SummarySection>

      {!isComplete && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
          padding: '14px 16px', marginBottom: 20,
        }}>
          <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 8, fontSize: 14 }}>
            Folgende Pflichtfelder fehlen noch:
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#dc2626', fontSize: 13 }}>
            {missing.map(m => <li key={m}>{m}</li>)}
          </ul>
        </div>
      )}

      {submitError && (
        <div className="error-message">{submitError}</div>
      )}

      {/* DSGVO Zustimmung */}
      <div style={{ background: '#fdf8f9', border: `1px solid ${datenschutz ? '#C8102E' : '#e0e0e8'}`, borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!datenschutz}
            onChange={e => onDatenschutz(e.target.checked)}
            style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, accentColor: '#C8102E', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 13, color: '#1a1a2e', lineHeight: 1.5 }}>
            <strong>Datenschutz-Einwilligung (Pflichtfeld): </strong>
            Ich stimme der Verarbeitung meiner personenbezogenen Daten durch <strong>Rita Last Versicherungen</strong> zur Bearbeitung meiner Angebotsanfrage zu.
            Die Daten werden ausschließlich für die Angebotserstellung verwendet und nicht an Dritte weitergegeben.
            Weitere Informationen finden Sie in der{' '}
            <a href="https://www.rita-last.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C8102E' }}>Datenschutzerklärung</a>.
            {!datenschutz && <span style={{ display: 'block', color: '#C8102E', marginTop: 4, fontSize: 12 }}>⚠️ Bitte Einwilligung bestätigen um die Anfrage absenden zu können.</span>}
          </span>
        </label>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <button
          className="btn btn-hogar"
          onClick={onSubmit}
          disabled={!isComplete || !datenschutz || submitting}
        >
          {submitting ? 'Wird gesendet...' : 'Anfrage absenden ✓'}
        </button>
      </div>
    </div>
  );
}
