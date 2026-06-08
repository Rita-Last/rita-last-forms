function Row({ label, value, missing }) {
  return (
    <div className="summary-row">
      <span className="summary-label">{label}</span>
      <span className="summary-value" style={{ color: (!value && missing) ? '#9ca3af' : undefined }}>
        {value || missing || '—'}
      </span>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="summary-section">
      <div className="summary-section-title">{icon} {title}</div>
      {children}
    </div>
  );
}

const SCHADENSART_LABELS = {
  scheibe: '🪟 Scheibenschaden / Glass Damage',
  unfall_gegner: '🚗 Unfall mit Unfallgegner / Accident with Third Party',
  unfall_eigen: '🔧 Unfall ohne Unfallgegner / Single Vehicle Accident',
  diebstahl: '🔓 Diebstahl / Theft',
};

function getMissingFields(formData, t) {
  const { personal, fahrzeug, schadensart, scheibe, unfall, eigenSchaden, gegner, gegnerSchaden, personenschaden, diebstahl } = formData;
  const missing = [];

  // Personal
  if (!personal.vorname) missing.push(t.personal.vorname);
  if (!personal.nachname) missing.push(t.personal.nachname);
  if (!personal.email) missing.push(t.personal.email);
  if (!personal.telefon) missing.push(t.personal.telefon);
  if (!personal.strasse) missing.push(t.personal.strasse);
  if (!personal.plz) missing.push(t.personal.plz);
  if (!personal.ort) missing.push(t.personal.ort);

  // Fahrzeug
  if (!fahrzeug.kennzeichen) missing.push(t.fahrzeug.kennzeichen);
  if (!fahrzeug.marke) missing.push(t.fahrzeug.marke);

  // Schadensart
  if (!schadensart) {
    missing.push(t.steps.schadensart);
    return missing;
  }

  if (schadensart === 'scheibe') {
    if (!scheibe.reparatur) missing.push(t.scheibe.reparatur);
    if (!scheibe.beschreibung) missing.push(t.scheibe.beschreibung);
  }

  if (schadensart === 'unfall_gegner' || schadensart === 'unfall_eigen') {
    const s = t.unfall;
    if (!unfall.fahrer_ist_vn) missing.push(s.fahrer_ist_vn);
    if (unfall.fahrer_ist_vn === 'nein') {
      if (!unfall.fahrer_name) missing.push(s.fahrer_name);
      if (!unfall.fuehrerschein_vorne) missing.push(s.fuehrerschein_vorne);
      if (!unfall.fuehrerschein_hinten) missing.push(s.fuehrerschein_hinten);
      if (!unfall.nie_dokument) missing.push(s.nie_dokument);
    }
    if (!unfall.datum) missing.push(s.datum);
    if (!unfall.schuld) missing.push(s.schuld);
    if (!unfall.ort_strasse) missing.push(s.ort_strasse);
    if (!unfall.ort_plz) missing.push(s.ort_plz);
    if (!unfall.ort_ort) missing.push(s.ort_ort);
    if (!unfall.hergang) missing.push(s.hergang);
    if (!unfall.unfallbogen) missing.push(s.unfallbogen);
    if (!unfall.polizei) missing.push(s.polizei);
    if (!unfall.zeugen) missing.push(s.zeugen);

    if (!eigenSchaden.beschreibung) missing.push(s.beschreibung);
    if (!eigenSchaden.bilder || eigenSchaden.bilder.length === 0) missing.push(s.bilder);
    if (!eigenSchaden.werkstatt) missing.push(s.werkstatt);
    if (eigenSchaden.werkstatt === 'eigen') {
      if (!eigenSchaden.werkstatt_name) missing.push('Name der Werkstatt');
      if (!eigenSchaden.werkstatt_tel) missing.push('Telefonnummer der Werkstatt');
      if (!eigenSchaden.werkstatt_strasse) missing.push('Straße & Hausnummer der Werkstatt');
      if (!eigenSchaden.werkstatt_plz) missing.push('PLZ der Werkstatt');
      if (!eigenSchaden.werkstatt_ort) missing.push('Ort der Werkstatt');
      if (!eigenSchaden.gutachter_termin) missing.push('Gutachtertermin (oder "Noch offen")');
    }

    if (!personenschaden.hat_schaden) missing.push(s.personenschaden_hat);
    if (personenschaden.hat_schaden === 'ja' && !personenschaden.beschreibung) missing.push(s.personenschaden_beschreibung);

    if (schadensart === 'unfall_gegner') {
      if (!gegner.kennzeichen) missing.push(s.gegner_kennzeichen);
      if (!gegner.land) missing.push(s.gegner_land);
      if (!gegner.marke_modell) missing.push(s.gegner_marke);
      if (!gegner.ist_inhaber) missing.push(s.gegner_ist_inhaber);
      if (!gegnerSchaden.beschreibung) missing.push(s.beschreibung + ' (' + s.gegnerSchaden_title + ')');
    }
  }

  if (schadensart === 'diebstahl') {
    if (!diebstahl || !diebstahl.polizei_bericht) missing.push(t.diebstahl.polizei_bericht_label);
  }

  return missing;
}

export default function StepSummary({ formData, onPrev, onSubmit, submitError, submitting, isComplete, progress, honeypot, onHoneypot, t, datenschutz, onDatenschutz }) {
  const s = t.summary;
  const { personal, fahrzeug, schadensart, scheibe, unfall, eigenSchaden, gegner, gegnerSchaden, personenschaden, diebstahl } = formData;

  const docLabel = (doc) => doc ? t.summary.doc_attached : s.missing;
  const imgCount = (arr) => arr && arr.length > 0 ? t.summary.image_count(arr.length) : s.missing;

  const missingFields = !isComplete ? getMissingFields(formData, t) : [];

  return (
    <div>
      <h2 className="step-title">{s.title}</h2>
      <p className="step-subtitle">{s.subtitle}</p>

      {!isComplete && (
        <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#9a3412' }}>
          <div style={{ fontWeight: 600, marginBottom: missingFields.length > 0 ? 8 : 0 }}>{s.incomplete_notice}</div>
          {missingFields.length > 0 && (
            <>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{s.missing_fields_header}</div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {missingFields.map((field, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>{field}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <Section title={s.personal} icon="👤">
        <Row label="Name" value={`${personal.vorname} ${personal.nachname}`.trim()} />
        <Row label="E-Mail" value={personal.email} />
        <Row label="Telefon / Phone" value={personal.telefon} />
        <Row label="Adresse / Address" value={[personal.strasse, personal.plz, personal.ort].filter(Boolean).join(', ')} />
      </Section>

      <Section title={s.fahrzeug} icon="🚗">
        <Row label="Kennzeichen / Plate" value={fahrzeug.kennzeichen} />
        <Row label="Marke / Make" value={fahrzeug.marke} />
      </Section>

      <Section title={s.schadensart} icon="📋">
        <Row label="Art / Type" value={SCHADENSART_LABELS[schadensart] || schadensart} />
      </Section>

      {schadensart === 'scheibe' && (
        <Section title={s.details} icon="🪟">
          <Row label="Reparatur / Repair" value={scheibe.reparatur} />
          <Row label="Beschreibung / Description" value={scheibe.beschreibung} />
        </Section>
      )}

      {(schadensart === 'unfall_gegner' || schadensart === 'unfall_eigen') && (
        <>
          <Section title="Fahrer / Driver" icon="🧑">
            <Row label={t.unfall.fahrer_ist_vn} value={unfall.fahrer_ist_vn} />
            {unfall.fahrer_ist_vn === 'nein' && (
              <>
                <Row label="Name" value={unfall.fahrer_name} />
                <Row label="Führerschein Vorne" value={docLabel(unfall.fuehrerschein_vorne)} />
                <Row label="Führerschein Hinten" value={docLabel(unfall.fuehrerschein_hinten)} />
                <Row label="NIE / Ausweis" value={docLabel(unfall.nie_dokument)} />
              </>
            )}
          </Section>
          <Section title="Unfalldaten / Accident" icon="💥">
            <Row label="Datum" value={unfall.datum} />
            <Row label="Uhrzeit / Time" value={unfall.uhrzeit} />
            <Row label="Schuld / Fault" value={unfall.schuld} />
            <Row label={t.unfall.ort_strasse} value={unfall.ort_strasse} />
            <Row label={t.unfall.ort_plz} value={unfall.ort_plz} />
            <Row label={t.unfall.ort_ort} value={unfall.ort_ort} />
            <Row label="Hergang / Description" value={unfall.hergang} />
            <Row label="Unfallbogen" value={unfall.unfallbogen} />
            <Row label="Polizei" value={unfall.polizei} />
            <Row label="Zeugen / Witnesses" value={unfall.zeugen} />
            {unfall.zeugen === 'ja' && <Row label="Zeugendaten" value={unfall.zeugen_info} />}
          </Section>
          <Section title="Eigener Schaden / Own Damage" icon="🔧">
            <Row label="Beschreibung" value={eigenSchaden.beschreibung} />
            <Row label="Fotos / Photos" value={imgCount(eigenSchaden.bilder)} />
            <Row label="Werkstatt / Workshop" value={eigenSchaden.werkstatt} />
            {eigenSchaden.werkstatt === 'eigen' && <>
              <Row label="Name Werkstatt" value={eigenSchaden.werkstatt_name} />
              <Row label="Telefon Werkstatt" value={eigenSchaden.werkstatt_tel} />
              <Row label="Adresse Werkstatt" value={[eigenSchaden.werkstatt_strasse, eigenSchaden.werkstatt_plz, eigenSchaden.werkstatt_ort].filter(Boolean).join(', ')} />
              <Row label="Gutachtertermin" value={eigenSchaden.gutachter_termin} />
            </>}
          </Section>
          {schadensart === 'unfall_gegner' && (
            <>
              <Section title="Unfallgegner / Third Party" icon="🤝">
                <Row label="Kennzeichen / Plate" value={gegner.kennzeichen} />
                <Row label="Land / Country" value={gegner.land} />
                <Row label="Marke / Make" value={gegner.marke_modell} />
                <Row label="Farbe / Color" value={gegner.farbe} />
                <Row label="Versicherung / Insurance" value={gegner.versicherung} />
                <Row label="Policenr." value={gegner.police_nr} />
                <Row label="Fahrername" value={gegner.fahrer_name} />
                <Row label={t.unfall.gegner_ist_inhaber} value={gegner.ist_inhaber} />
              </Section>
              <Section title="Gegner Schaden / Third Party Damage" icon="📷">
                <Row label="Beschreibung" value={gegnerSchaden.beschreibung} />
                <Row label="Fotos / Photos" value={imgCount(gegnerSchaden.bilder)} />
              </Section>
            </>
          )}
          <Section title="Personenschäden / Injuries" icon="🏥">
            <Row label="Personenschäden" value={personenschaden.hat_schaden} />
            {personenschaden.hat_schaden === 'ja' && (
              <>
                <Row label="Beschreibung" value={personenschaden.beschreibung} />
                <Row label="Arztbericht" value={docLabel(personenschaden.arztbericht)} />
              </>
            )}
          </Section>
        </>
      )}

      {schadensart === 'diebstahl' && (
        <Section title={s.details} icon="🔓">
          <Row label="Polizeibericht / Police Report" value={docLabel(diebstahl && diebstahl.polizei_bericht)} />
        </Section>
      )}

      {submitError && (
        <div className="error-message" style={{ marginBottom: 20 }}>
          {submitError}
        </div>
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
            Ich stimme der Verarbeitung meiner personenbezogenen Daten durch <strong>Rita Last Versicherungen</strong> zur Bearbeitung meiner Schadensmeldung zu.
            Die Daten werden ausschließlich für die Schadenbearbeitung verwendet und nicht an Dritte weitergegeben.
            Weitere Informationen finden Sie in der{' '}
            <a href="https://www.rita-last.com" target="_blank" rel="noopener noreferrer" style={{ color: '#C8102E' }}>Datenschutzerklärung</a>.
            {!datenschutz && <span style={{ display: 'block', color: '#C8102E', marginTop: 4, fontSize: 12 }}>⚠️ Bitte Einwilligung bestätigen um das Formular absenden zu können.</span>}
          </span>
        </label>
      </div>

      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{s.submit_note}</p>

      {/* Honeypot */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <input type="text" name="website" value={honeypot} onChange={e => onHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev} disabled={submitting}>{t.nav.prev}</button>
        <button
          className="btn btn-success"
          onClick={onSubmit}
          disabled={!isComplete || !datenschutz || submitting}
        >
          {submitting ? t.nav.submitting : t.nav.submit}
        </button>
      </div>
    </div>
  );
}
