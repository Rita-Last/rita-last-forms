import { useState } from 'react';
import Field from '../components/Field';
import FileUpload from '../components/FileUpload';

const compressImage = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 1200;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ name: file.name, dataUrl: canvas.toDataURL('image/jpeg', 0.8) });
    };
    img.onerror = () => resolve({ name: file.name, dataUrl: ev.target.result });
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

function SectionHeader({ children }) {
  return (
    <div style={{
      fontSize: 16, fontWeight: 700, color: '#1a56db',
      borderBottom: '2px solid #e5e7eb', paddingBottom: 8,
      marginTop: 32, marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <label key={opt.value} className="radio-option">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function StepUnfall({ schadensart, unfall, eigenSchaden, gegner, gegnerSchaden, personenschaden, onChange, onNext, onPrev, t }) {
  const s = t.unfall;
  const withGegner = schadensart === 'unfall_gegner';
  const [attempted, setAttempted] = useState(false);

  const setUnfall = (k, v) => onChange({ unfall: { ...unfall, [k]: v } });
  const setEigen = (k, v) => onChange({ eigenSchaden: { ...eigenSchaden, [k]: v } });
  const setGegner = (k, v) => onChange({ gegner: { ...gegner, [k]: v } });
  const setGegnerSchaden = (k, v) => onChange({ gegnerSchaden: { ...gegnerSchaden, [k]: v } });
  const setPersonen = (k, v) => onChange({ personenschaden: { ...personenschaden, [k]: v } });

  const handleEigenBilder = async (e) => {
    const files = Array.from(e.target.files);
    const compressed = await Promise.all(files.map(compressImage));
    setEigen('bilder', [...(eigenSchaden.bilder || []), ...compressed]);
  };

  const handleGegnerBilder = async (e) => {
    const files = Array.from(e.target.files);
    const compressed = await Promise.all(files.map(compressImage));
    setGegnerSchaden('bilder', [...(gegnerSchaden.bilder || []), ...compressed]);
  };

  const fahrer_ist_vn = unfall.fahrer_ist_vn;
  const fahrerFieldsOk = fahrer_ist_vn === 'ja' ||
    (fahrer_ist_vn === 'nein' && unfall.fahrer_name && unfall.fuehrerschein_vorne && unfall.fuehrerschein_hinten && unfall.nie_dokument);

  const werkstattExtra = eigenSchaden.werkstatt === 'eigen'
    ? (eigenSchaden.werkstatt_name && eigenSchaden.werkstatt_tel &&
       eigenSchaden.werkstatt_strasse && eigenSchaden.werkstatt_plz && eigenSchaden.werkstatt_ort &&
       eigenSchaden.gutachter_termin)
    : true;

  const personenExtra = personenschaden.hat_schaden === 'ja'
    ? !!personenschaden.beschreibung
    : !!personenschaden.hat_schaden;

  const gegnerRequired = withGegner
    ? (gegner.kennzeichen && gegner.land && gegner.marke_modell && gegner.ist_inhaber && gegnerSchaden.beschreibung)
    : true;

  const canNext =
    fahrer_ist_vn &&
    fahrerFieldsOk &&
    unfall.datum &&
    unfall.uhrzeit &&
    (withGegner ? unfall.schuld : true) &&
    unfall.ort_strasse && unfall.ort_plz && unfall.ort_ort &&
    unfall.hergang &&
    (withGegner ? unfall.unfallbogen : true) && unfall.polizei && unfall.zeugen &&
    eigenSchaden.beschreibung &&
    eigenSchaden.bilder && eigenSchaden.bilder.length > 0 &&
    eigenSchaden.werkstatt && werkstattExtra &&
    personenExtra &&
    gegnerRequired;

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  // Build missing fields list for error box
  const missingFields = [];
  if (!fahrer_ist_vn) missingFields.push('War der Versicherungsnehmer der Fahrer?');
  if (fahrer_ist_vn === 'nein') {
    if (!unfall.fahrer_name) missingFields.push('Name des Fahrers');
    if (!unfall.fuehrerschein_vorne) missingFields.push('Führerschein Vorderseite hochladen');
    if (!unfall.fuehrerschein_hinten) missingFields.push('Führerschein Rückseite hochladen');
    if (!unfall.nie_dokument) missingFields.push('NIE-Dokument hochladen');
  }
  if (!unfall.datum) missingFields.push('Unfalldatum');
  if (!unfall.uhrzeit) missingFields.push('Unfallzeit (oder "Nicht bekannt" auswählen)');
  if (withGegner && !unfall.schuld) missingFields.push('Schuldfrage');
  if (!unfall.ort_strasse) missingFields.push('Unfallort: Straße');
  if (!unfall.ort_plz) missingFields.push('Unfallort: PLZ');
  if (!unfall.ort_ort) missingFields.push('Unfallort: Ort');
  if (!unfall.hergang) missingFields.push('Unfallhergang');
  if (withGegner && !unfall.unfallbogen) missingFields.push('Unfallbogen ausgefüllt?');
  if (!unfall.polizei) missingFields.push('Polizei verständigt?');
  if (!unfall.zeugen) missingFields.push('Zeugen vorhanden?');
  if (!eigenSchaden.beschreibung) missingFields.push('Schadensbeschreibung (eigener Schaden)');
  if (!eigenSchaden.bilder || eigenSchaden.bilder.length === 0) missingFields.push('Fotos des Schadens (min. 1)');
  if (!eigenSchaden.werkstatt) missingFields.push('Werkstattwahl');
  if (eigenSchaden.werkstatt === 'eigen') {
    if (!eigenSchaden.werkstatt_name) missingFields.push('Name der Werkstatt');
    if (!eigenSchaden.werkstatt_tel) missingFields.push('Telefonnummer der Werkstatt');
    if (!eigenSchaden.werkstatt_strasse) missingFields.push('Straße & Hausnummer der Werkstatt');
    if (!eigenSchaden.werkstatt_plz) missingFields.push('PLZ der Werkstatt');
    if (!eigenSchaden.werkstatt_ort) missingFields.push('Ort der Werkstatt');
    if (!eigenSchaden.gutachter_termin) missingFields.push('Gutachtertermin (oder "Noch offen" wählen)');
  }
  if (!personenschaden.hat_schaden) missingFields.push('Personenschaden vorhanden?');
  if (personenschaden.hat_schaden === 'ja' && !personenschaden.beschreibung) missingFields.push('Beschreibung Personenschaden');
  if (withGegner) {
    if (!gegner.kennzeichen) missingFields.push('Kennzeichen Unfallgegner');
    if (!gegner.land) missingFields.push('Land des Unfallgegners');
    if (!gegner.marke_modell) missingFields.push('Marke/Modell des Gegners');
    if (!gegner.ist_inhaber) missingFields.push('Ist Gegner Fahrzeuginhaber?');
    if (!gegnerSchaden.beschreibung) missingFields.push('Schadensbeschreibung (Gegner)');
  }

  return (
    <div>
      <h2 className="step-title">{s.title}</h2>

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
            {missingFields.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {/* === FAHRER === */}
      <SectionHeader>{s.fahrer_title}</SectionHeader>

      {/* fahrer_ist_vn question */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, marginBottom: 10,
          color: attempted && !fahrer_ist_vn ? '#b91c1c' : '#374151'
        }}>
          {s.fahrer_ist_vn} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        <RadioGroup
          name="fahrer_ist_vn"
          value={unfall.fahrer_ist_vn}
          onChange={(v) => setUnfall('fahrer_ist_vn', v)}
          options={[{ value: 'ja', label: s.ja }, { value: 'nein', label: s.nein }]}
        />
      </div>

      {/* Driver fields: only show when fahrer_ist_vn === 'nein' */}
      {unfall.fahrer_ist_vn === 'nein' && (
        <>
          <div className="form-grid single">
            <Field label={s.fahrer_name} required>
              <input
                type="text"
                value={unfall.fahrer_name}
                onChange={(e) => setUnfall('fahrer_name', e.target.value)}
                className={attempted && !unfall.fahrer_name ? 'field-error' : unfall.fahrer_name ? 'filled' : ''}
              />
            </Field>
          </div>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <Field label={s.fuehrerschein_vorne} required>
              <FileUpload value={unfall.fuehrerschein_vorne} onChange={(v) => setUnfall('fuehrerschein_vorne', v)} t={t} />
            </Field>
            <Field label={s.fuehrerschein_hinten} required>
              <FileUpload value={unfall.fuehrerschein_hinten} onChange={(v) => setUnfall('fuehrerschein_hinten', v)} t={t} />
            </Field>
            <Field label={s.nie_dokument} required full>
              <FileUpload value={unfall.nie_dokument} onChange={(v) => setUnfall('nie_dokument', v)} t={t} />
            </Field>
          </div>
        </>
      )}

      {/* === UNFALLDATEN === */}
      <SectionHeader>{s.title}</SectionHeader>
      <div className="form-grid">
        <Field label={s.datum} required>
          <input
            type="date"
            value={unfall.datum}
            onChange={(e) => setUnfall('datum', e.target.value)}
            className={attempted && !unfall.datum ? 'field-error' : unfall.datum ? 'filled' : ''}
          />
        </Field>
        <Field label={s.uhrzeit} required>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="time"
              value={unfall.uhrzeit === 'Nicht bekannt' ? '' : (unfall.uhrzeit || '')}
              onChange={e => setUnfall('uhrzeit', e.target.value)}
              disabled={unfall.uhrzeit === 'Nicht bekannt'}
              className={attempted && !unfall.uhrzeit ? 'field-error' : unfall.uhrzeit ? 'filled' : ''}
              style={{ width: '100%' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', padding: '8px 12px', background: '#f7f7fa', borderRadius: 8, userSelect: 'none' }}>
              <input
                type="checkbox"
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#C8102E', flexShrink: 0 }}
                checked={unfall.uhrzeit === 'Nicht bekannt'}
                onChange={e => setUnfall('uhrzeit', e.target.checked ? 'Nicht bekannt' : '')}
              />
              <span style={{ fontWeight: 500, color: '#1a1a2e' }}>Nicht bekannt</span>
            </label>
          </div>
        </Field>
        {withGegner && (
          <Field label={s.schuld} required full>
            <select
              value={unfall.schuld}
              onChange={(e) => setUnfall('schuld', e.target.value)}
              className={attempted && !unfall.schuld ? 'field-error' : unfall.schuld ? 'filled' : ''}
            >
              <option value="">–</option>
              <option value="eigen">{s.schuld_eigen}</option>
              <option value="fremd">{s.schuld_fremd}</option>
              <option value="unbekannt">{s.schuld_unbekannt}</option>
            </select>
          </Field>
        )}
        {/* Unfallort label + location fields */}
        <div style={{ gridColumn: '1 / -1', fontWeight: 700, fontSize: 14, color: '#1a56db', marginTop: 8, marginBottom: 4 }}>
          {s.unfallort_label}
        </div>
        <Field label={s.ort_strasse} required full>
          <input
            type="text"
            value={unfall.ort_strasse}
            onChange={(e) => setUnfall('ort_strasse', e.target.value)}
            className={attempted && !unfall.ort_strasse ? 'field-error' : unfall.ort_strasse ? 'filled' : ''}
          />
        </Field>
        <Field label={s.ort_plz} required>
          <input
            type="text"
            value={unfall.ort_plz}
            onChange={(e) => setUnfall('ort_plz', e.target.value)}
            className={attempted && !unfall.ort_plz ? 'field-error' : unfall.ort_plz ? 'filled' : ''}
          />
        </Field>
        <Field label={s.ort_ort} required>
          <input
            type="text"
            value={unfall.ort_ort}
            onChange={(e) => setUnfall('ort_ort', e.target.value)}
            className={attempted && !unfall.ort_ort ? 'field-error' : unfall.ort_ort ? 'filled' : ''}
          />
        </Field>
        <Field label={s.hergang} required full>
          <textarea
            value={unfall.hergang}
            onChange={(e) => setUnfall('hergang', e.target.value)}
            className={attempted && !unfall.hergang ? 'field-error' : unfall.hergang ? 'filled' : ''}
            rows={4}
          />
        </Field>
      </div>

      {/* Unfallbogen — only for unfall_gegner */}
      {withGegner && (
        <div style={{ marginTop: 20 }}>
          <div style={{
            fontWeight: 600, fontSize: 14, marginBottom: 10,
            color: attempted && !unfall.unfallbogen ? '#b91c1c' : '#374151'
          }}>
            {s.unfallbogen} <span style={{ color: '#ef4444' }}>*</span>
          </div>
          <RadioGroup
            name="unfallbogen"
            value={unfall.unfallbogen}
            onChange={(v) => setUnfall('unfallbogen', v)}
            options={[{ value: 'ja', label: s.ja }, { value: 'nein', label: s.nein }]}
          />
          {unfall.unfallbogen === 'ja' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#374151' }}>{s.unfallbogen_upload}</div>
              <FileUpload value={unfall.unfallbogen_bild} onChange={(v) => setUnfall('unfallbogen_bild', v)} t={t} />
            </div>
          )}
        </div>
      )}

      {/* Polizei */}
      <div style={{ marginTop: 20 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, marginBottom: 10,
          color: attempted && !unfall.polizei ? '#b91c1c' : '#374151'
        }}>
          {s.polizei} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        <RadioGroup
          name="polizei"
          value={unfall.polizei}
          onChange={(v) => setUnfall('polizei', v)}
          options={[{ value: 'ja', label: s.ja }, { value: 'nein', label: s.nein }]}
        />
        {unfall.polizei === 'ja' && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#374151' }}>{s.polizei_upload}</div>
            <FileUpload value={unfall.polizei_bericht} onChange={(v) => setUnfall('polizei_bericht', v)} t={t} />
          </div>
        )}
      </div>

      {/* Zeugen */}
      <div style={{ marginTop: 20 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, marginBottom: 10,
          color: attempted && !unfall.zeugen ? '#b91c1c' : '#374151'
        }}>
          {s.zeugen} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        <RadioGroup
          name="zeugen"
          value={unfall.zeugen}
          onChange={(v) => setUnfall('zeugen', v)}
          options={[{ value: 'ja', label: s.ja }, { value: 'nein', label: s.nein }]}
        />
        {unfall.zeugen === 'ja' && (
          <div style={{ marginTop: 12 }}>
            <div className="form-grid single">
              <Field label={s.zeugen_info}>
                <textarea
                  value={unfall.zeugen_info}
                  onChange={(e) => setUnfall('zeugen_info', e.target.value)}
                  className={unfall.zeugen_info ? 'filled' : ''}
                  rows={3}
                />
              </Field>
            </div>
          </div>
        )}
      </div>

      {/* === EIGENER SCHADEN === */}
      <SectionHeader>{s.eigenSchaden_title}</SectionHeader>
      <div className="form-grid single">
        <Field label={s.beschreibung} required>
          <textarea
            value={eigenSchaden.beschreibung}
            onChange={(e) => setEigen('beschreibung', e.target.value)}
            className={attempted && !eigenSchaden.beschreibung ? 'field-error' : eigenSchaden.beschreibung ? 'filled' : ''}
            rows={3}
          />
        </Field>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, marginBottom: 4,
          color: attempted && (!eigenSchaden.bilder || eigenSchaden.bilder.length === 0) ? '#b91c1c' : '#374151'
        }}>
          {s.bilder} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        {s.bilder_required_hint && (
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{s.bilder_required_hint}</div>
        )}
        <label className="upload-area" style={{ display: 'block' }}>
          <input type="file" accept="image/*" multiple onChange={handleEigenBilder} style={{ display: 'none' }} />
          <div className="upload-icon">📷</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.upload.click}</div>
          <div style={{ fontSize: 12 }}>{t.upload.types}</div>
        </label>
        {eigenSchaden.bilder && eigenSchaden.bilder.length > 0 && (
          <div className="image-preview-grid">
            {eigenSchaden.bilder.map((img, i) => (
              <div key={i} className="image-thumb">
                <img src={img.dataUrl} alt={img.name} />
                <button
                  type="button"
                  onClick={() => setEigen('bilder', eigenSchaden.bilder.filter((_, j) => j !== i))}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <Field label={s.werkstatt} required>
          <select
            value={eigenSchaden.werkstatt}
            onChange={(e) => setEigen('werkstatt', e.target.value)}
            className={attempted && !eigenSchaden.werkstatt ? 'field-error' : eigenSchaden.werkstatt ? 'filled' : ''}
          >
            <option value="">–</option>
            <option value="eigen">{s.werkstatt_eigen}</option>
            <option value="generali">{s.werkstatt_generali}</option>
            <option value="offen">{s.werkstatt_offen}</option>
          </select>
        </Field>
        {eigenSchaden.werkstatt === 'eigen' && (
          <div style={{ marginTop: 12, background: '#fdf8f9', border: '1px solid #f0d0d5', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#C8102E', marginBottom: 12 }}>🔧 Werkstattdaten</div>
            <div className="form-grid">
              <Field label="Name der Werkstatt" required full>
                <input type="text" placeholder="z.B. Taller Mecánico Pérez"
                  value={eigenSchaden.werkstatt_name || ''}
                  onChange={(e) => setEigen('werkstatt_name', e.target.value)}
                  className={attempted && !eigenSchaden.werkstatt_name ? 'field-error' : eigenSchaden.werkstatt_name ? 'filled' : ''} />
              </Field>
              <Field label="Telefonnummer" required>
                <input type="tel" placeholder="+34 971 000 000"
                  value={eigenSchaden.werkstatt_tel || ''}
                  onChange={(e) => setEigen('werkstatt_tel', e.target.value)}
                  className={attempted && !eigenSchaden.werkstatt_tel ? 'field-error' : eigenSchaden.werkstatt_tel ? 'filled' : ''} />
              </Field>
              <Field label="Straße & Hausnummer" required>
                <input type="text" placeholder="Calle Mayor, 12"
                  value={eigenSchaden.werkstatt_strasse || ''}
                  onChange={(e) => setEigen('werkstatt_strasse', e.target.value)}
                  className={attempted && !eigenSchaden.werkstatt_strasse ? 'field-error' : eigenSchaden.werkstatt_strasse ? 'filled' : ''} />
              </Field>
              <Field label="PLZ" required>
                <input type="text" placeholder="07001"
                  value={eigenSchaden.werkstatt_plz || ''}
                  onChange={(e) => setEigen('werkstatt_plz', e.target.value)}
                  className={attempted && !eigenSchaden.werkstatt_plz ? 'field-error' : eigenSchaden.werkstatt_plz ? 'filled' : ''} />
              </Field>
              <Field label="Ort" required>
                <input type="text" placeholder="Palma de Mallorca"
                  value={eigenSchaden.werkstatt_ort || ''}
                  onChange={(e) => setEigen('werkstatt_ort', e.target.value)}
                  className={attempted && !eigenSchaden.werkstatt_ort ? 'field-error' : eigenSchaden.werkstatt_ort ? 'filled' : ''} />
              </Field>
              <Field label="Gutachtertermin" required>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input type="date"
                    value={eigenSchaden.gutachter_termin === 'Noch offen' ? '' : (eigenSchaden.gutachter_termin || '')}
                    onChange={(e) => setEigen('gutachter_termin', e.target.value)}
                    disabled={eigenSchaden.gutachter_termin === 'Noch offen'}
                    className={attempted && !eigenSchaden.gutachter_termin ? 'field-error' : eigenSchaden.gutachter_termin ? 'filled' : ''} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox"
                      checked={eigenSchaden.gutachter_termin === 'Noch offen'}
                      onChange={e => setEigen('gutachter_termin', e.target.checked ? 'Noch offen' : '')} />
                    Noch offen
                  </label>
                </div>
              </Field>
            </div>
          </div>
        )}
        {eigenSchaden.werkstatt === 'generali' && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: 14, color: '#1e40af' }}>
            {s.werkstatt_generali_info}
          </div>
        )}
        {eigenSchaden.werkstatt === 'offen' && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: '#fefce8', border: '1px solid #fde68a', borderRadius: 8, fontSize: 14, color: '#92400e' }}>
            {s.werkstatt_offen_info}
          </div>
        )}
      </div>

      {/* === UNFALLGEGNER === */}
      {withGegner && (
        <>
          <SectionHeader>{s.gegner_title}</SectionHeader>
          <div className="form-grid">
            <Field label={s.gegner_kennzeichen} required>
              <input
                type="text"
                value={gegner.kennzeichen}
                onChange={(e) => setGegner('kennzeichen', e.target.value.toUpperCase())}
                className={attempted && !gegner.kennzeichen ? 'field-error' : gegner.kennzeichen ? 'filled' : ''}
                style={{ textTransform: 'uppercase' }}
              />
            </Field>
            <Field label={s.gegner_land} required>
              <input
                type="text"
                value={gegner.land}
                onChange={(e) => setGegner('land', e.target.value)}
                className={attempted && !gegner.land ? 'field-error' : gegner.land ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_marke} required>
              <input
                type="text"
                value={gegner.marke_modell}
                onChange={(e) => setGegner('marke_modell', e.target.value)}
                className={attempted && !gegner.marke_modell ? 'field-error' : gegner.marke_modell ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_farbe} optional>
              <input
                type="text"
                value={gegner.farbe}
                onChange={(e) => setGegner('farbe', e.target.value)}
                className={gegner.farbe ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_versicherung} optional>
              <input
                type="text"
                value={gegner.versicherung}
                onChange={(e) => setGegner('versicherung', e.target.value)}
                className={gegner.versicherung ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_police} optional>
              <input
                type="text"
                value={gegner.police_nr}
                onChange={(e) => setGegner('police_nr', e.target.value)}
                className={gegner.police_nr ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_fahrer} optional>
              <input
                type="text"
                value={gegner.fahrer_name}
                onChange={(e) => setGegner('fahrer_name', e.target.value)}
                className={gegner.fahrer_name ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_geburtsdatum} optional>
              <input
                type="date"
                value={gegner.geburtsdatum}
                onChange={(e) => setGegner('geburtsdatum', e.target.value)}
                className={gegner.geburtsdatum ? 'filled' : ''}
              />
            </Field>
            <Field label={s.gegner_fuehrerschein} optional>
              <input
                type="date"
                value={gegner.fuehrerschein_datum}
                onChange={(e) => setGegner('fuehrerschein_datum', e.target.value)}
                className={gegner.fuehrerschein_datum ? 'filled' : ''}
              />
            </Field>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{
              fontWeight: 600, fontSize: 14, marginBottom: 10,
              color: attempted && !gegner.ist_inhaber ? '#b91c1c' : '#374151'
            }}>
              {s.gegner_ist_inhaber} <span style={{ color: '#ef4444' }}>*</span>
            </div>
            <RadioGroup
              name="gegner_ist_inhaber"
              value={gegner.ist_inhaber}
              onChange={(v) => setGegner('ist_inhaber', v)}
              options={[
                { value: 'ja', label: s.gegner_ja },
                { value: 'nein', label: s.gegner_nein },
                { value: 'unbekannt', label: s.gegner_unbekannt },
              ]}
            />
          </div>

          <SectionHeader>{s.gegnerSchaden_title}</SectionHeader>
          <div className="form-grid single">
            <Field label={s.beschreibung} required>
              <textarea
                value={gegnerSchaden.beschreibung}
                onChange={(e) => setGegnerSchaden('beschreibung', e.target.value)}
                className={attempted && !gegnerSchaden.beschreibung ? 'field-error' : gegnerSchaden.beschreibung ? 'filled' : ''}
                rows={3}
              />
            </Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#374151' }}>{s.bilder}</div>
            {s.kein_upload_nötig && (
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{s.kein_upload_nötig}</div>
            )}
            <label className="upload-area" style={{ display: 'block' }}>
              <input type="file" accept="image/*" multiple onChange={handleGegnerBilder} style={{ display: 'none' }} />
              <div className="upload-icon">📷</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.upload.click}</div>
              <div style={{ fontSize: 12 }}>{t.upload.types}</div>
            </label>
            {gegnerSchaden.bilder && gegnerSchaden.bilder.length > 0 && (
              <div className="image-preview-grid">
                {gegnerSchaden.bilder.map((img, i) => (
                  <div key={i} className="image-thumb">
                    <img src={img.dataUrl} alt={img.name} />
                    <button
                      type="button"
                      onClick={() => setGegnerSchaden('bilder', gegnerSchaden.bilder.filter((_, j) => j !== i))}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* === PERSONENSCHÄDEN === */}
      <SectionHeader>{s.personenschaden_title}</SectionHeader>
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontWeight: 600, fontSize: 14, marginBottom: 10,
          color: attempted && !personenschaden.hat_schaden ? '#b91c1c' : '#374151'
        }}>
          {s.personenschaden_hat} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        <RadioGroup
          name="personenschaden_hat"
          value={personenschaden.hat_schaden}
          onChange={(v) => setPersonen('hat_schaden', v)}
          options={[{ value: 'ja', label: s.ja }, { value: 'nein', label: s.nein }]}
        />
        {personenschaden.hat_schaden === 'ja' && (
          <div style={{ marginTop: 16 }}>
            <div className="form-grid single">
              <Field label={s.personenschaden_beschreibung} required>
                <textarea
                  value={personenschaden.beschreibung}
                  onChange={(e) => setPersonen('beschreibung', e.target.value)}
                  className={attempted && !personenschaden.beschreibung ? 'field-error' : personenschaden.beschreibung ? 'filled' : ''}
                  rows={3}
                />
              </Field>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4, color: '#374151' }}>
                {s.personenschaden_arzt}
                <span className="optional-badge" style={{ marginLeft: 6, fontSize: 11, fontWeight: 400, color: '#6b7280', background: '#f3f4f6', borderRadius: 4, padding: '1px 6px' }}>optional</span>
              </div>
              {s.kein_upload_nötig && (
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{s.kein_upload_nötig}</div>
              )}
              <FileUpload value={personenschaden.arztbericht} onChange={(v) => setPersonen('arztbericht', v)} t={t} />
            </div>
          </div>
        )}
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>{t.nav.prev}</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>
              ⚠️ Bitte alle Pflichtfelder ausfüllen
            </span>
          )}
          <button className="btn btn-primary" onClick={handleNext}>{t.nav.next}</button>
        </div>
      </div>
    </div>
  );
}
