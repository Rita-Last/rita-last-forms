import { useState } from 'react';

const T = {
  de: {
    title: 'Nutzung',
    subtitle: 'Wie wird die Immobilie genutzt?',
    errorHeader: '❌ Bitte füllen Sie alle Pflichtfelder aus:',
    rolleLabel: 'Sind Sie Eigentümer/in oder Mieter/in?',
    eigentuemer: 'Eigentümer/in', mieter: 'Mieter/in',
    artLabel: 'Art der Nutzung',
    eigennutzung: 'Eigentum mit Eigennutzung',
    vermietet: 'Eigentum mit Vermietung',
    wohnsitz: 'Wohnsitzart',
    hauptwohnsitz: 'Hauptwohnsitz', nebenwohnsitz: 'Nebenwohnsitz',
    vermietungsart: 'Vermietungsart',
    langzeit: 'Langzeitvermietung', saisonal: 'Saisonale Vermietung', touristisch: 'Touristische Vermietung',
    errors: {
      rolle: 'Eigentümer/in oder Mieter/in',
      art: 'Art der Eigentumsnutzung',
      eigennutzungTyp: 'Hauptwohnsitz oder Nebenwohnsitz',
      vermietungTyp: 'Vermietungsart',
      mieterTyp: 'Hauptwohnsitz oder Nebenwohnsitz',
    },
    requiredHint: '⚠️ Bitte alle Pflichtfelder ausfüllen',
    back: '← Zurück', next: 'Weiter →',
  },
  en: {
    title: 'Usage',
    subtitle: 'How is the property used?',
    errorHeader: '❌ Please fill in all required fields:',
    rolleLabel: 'Are you the owner or tenant?',
    eigentuemer: 'Owner', mieter: 'Tenant',
    artLabel: 'Type of use',
    eigennutzung: 'Owner-occupied',
    vermietet: 'Rented out',
    wohnsitz: 'Residence type',
    hauptwohnsitz: 'Primary residence', nebenwohnsitz: 'Secondary residence',
    vermietungsart: 'Rental type',
    langzeit: 'Long-term rental', saisonal: 'Seasonal rental', touristisch: 'Tourist rental',
    errors: {
      rolle: 'Owner or Tenant',
      art: 'Type of ownership use',
      eigennutzungTyp: 'Primary or Secondary residence',
      vermietungTyp: 'Rental type',
      mieterTyp: 'Primary or Secondary residence',
    },
    requiredHint: '⚠️ Please fill in all required fields',
    back: '← Back', next: 'Next →',
  },
};

export default function StepHogarNutzung({ data, onChange, onNext, onPrev, lang = 'de' }) {
  const [attempted, setAttempted] = useState(false);
  const t = T[lang] || T.de;

  const selectRolle = (rolle) => {
    onChange({ rolle, art: '', eigennutzung_typ: '', vermietung_typ: '', mieter_typ: '' });
  };

  const selectArt = (art) => {
    onChange({ art, eigennutzung_typ: '', vermietung_typ: '' });
  };

  const canNext =
    data.rolle &&
    (data.rolle === 'mieter'
      ? data.mieter_typ
      : data.art && (data.art === 'eigennutzung' ? data.eigennutzung_typ : data.vermietung_typ));

  const handleNext = () => {
    if (!canNext) {
      setAttempted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  const rolleCardStyle = (val) => ({
    border: `2px solid ${data.rolle === val ? '#cc0000' : attempted && !data.rolle ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 12,
    padding: '20px 16px',
    cursor: 'pointer',
    background: data.rolle === val ? '#fff5f5' : attempted && !data.rolle ? '#fef2f2' : 'white',
    color: data.rolle === val ? '#cc0000' : '#374151',
    fontWeight: data.rolle === val ? 700 : 400,
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center',
  });

  const artCardStyle = (val) => ({
    border: `2px solid ${data.art === val ? '#cc0000' : attempted && data.rolle === 'eigentuemer' && !data.art ? '#ef4444' : '#d1d5db'}`,
    borderRadius: 12,
    padding: '16px 12px',
    cursor: 'pointer',
    background: data.art === val ? '#fff5f5' : attempted && data.rolle === 'eigentuemer' && !data.art ? '#fef2f2' : 'white',
    color: data.art === val ? '#cc0000' : '#374151',
    fontWeight: data.art === val ? 700 : 400,
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center',
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
            {!data.rolle && <li>{t.errors.rolle}</li>}
            {data.rolle === 'eigentuemer' && !data.art && <li>{t.errors.art}</li>}
            {data.rolle === 'eigentuemer' && data.art === 'eigennutzung' && !data.eigennutzung_typ && <li>{t.errors.eigennutzungTyp}</li>}
            {data.rolle === 'eigentuemer' && data.art === 'vermietet' && !data.vermietung_typ && <li>{t.errors.vermietungTyp}</li>}
            {data.rolle === 'mieter' && !data.mieter_typ && <li>{t.errors.mieterTyp}</li>}
          </ul>
        </div>
      )}

      {/* Eigentümer/in oder Mieter/in */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
          {t.rolleLabel} <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={rolleCardStyle('eigentuemer')} onClick={() => selectRolle('eigentuemer')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 15 }}>{t.eigentuemer}</div>
          </div>
          <div style={rolleCardStyle('mieter')} onClick={() => selectRolle('mieter')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔑</div>
            <div style={{ fontSize: 15 }}>{t.mieter}</div>
          </div>
        </div>
      </div>

      {/* Eigentümer: Art der Nutzung */}
      {data.rolle === 'eigentuemer' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
            {t.artLabel} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={artCardStyle('eigennutzung')} onClick={() => selectArt('eigennutzung')}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏡</div>
              <div style={{ fontSize: 14 }}>{t.eigennutzung}</div>
            </div>
            <div style={artCardStyle('vermietet')} onClick={() => selectArt('vermietet')}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>
              <div style={{ fontSize: 14 }}>{t.vermietet}</div>
            </div>
          </div>
        </div>
      )}

      {/* Eigentümer + Eigennutzung */}
      {data.rolle === 'eigentuemer' && data.art === 'eigennutzung' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.eigennutzung_typ ? '#b91c1c' : '#374151'
          }}>
            {t.wohnsitz} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'hauptwohnsitz', label: t.hauptwohnsitz },
              { value: 'nebenwohnsitz', label: t.nebenwohnsitz },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="eigennutzung_typ"
                  value={opt.value}
                  checked={data.eigennutzung_typ === opt.value}
                  onChange={() => onChange({ eigennutzung_typ: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Eigentümer + Vermietung */}
      {data.rolle === 'eigentuemer' && data.art === 'vermietet' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.vermietung_typ ? '#b91c1c' : '#374151'
          }}>
            {t.vermietungsart} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'langzeit', label: t.langzeit },
              { value: 'saisonal', label: t.saisonal },
              { value: 'touristisch', label: t.touristisch },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="vermietung_typ"
                  value={opt.value}
                  checked={data.vermietung_typ === opt.value}
                  onChange={() => onChange({ vermietung_typ: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Mieter/in */}
      {data.rolle === 'mieter' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.mieter_typ ? '#b91c1c' : '#374151'
          }}>
            {t.wohnsitz} <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'hauptwohnsitz', label: t.hauptwohnsitz },
              { value: 'nebenwohnsitz', label: t.nebenwohnsitz },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="mieter_typ"
                  value={opt.value}
                  checked={data.mieter_typ === opt.value}
                  onChange={() => onChange({ mieter_typ: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      )}

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
