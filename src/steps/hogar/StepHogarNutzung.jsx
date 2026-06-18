import { useState } from 'react';

export default function StepHogarNutzung({ data, onChange, onNext, onPrev }) {
  const [attempted, setAttempted] = useState(false);

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
      <h2 className="step-title">Nutzung</h2>
      <p className="step-subtitle">Wie wird die Immobilie genutzt?</p>

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
            {!data.rolle && <li>Eigentümer/in oder Mieter/in</li>}
            {data.rolle === 'eigentuemer' && !data.art && <li>Art der Eigentumsnutzung</li>}
            {data.rolle === 'eigentuemer' && data.art === 'eigennutzung' && !data.eigennutzung_typ && <li>Hauptwohnsitz oder Nebenwohnsitz</li>}
            {data.rolle === 'eigentuemer' && data.art === 'vermietet' && !data.vermietung_typ && <li>Vermietungsart</li>}
            {data.rolle === 'mieter' && !data.mieter_typ && <li>Hauptwohnsitz oder Nebenwohnsitz</li>}
          </ul>
        </div>
      )}

      {/* Eigentümer/in oder Mieter/in */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
          Sind Sie Eigentümer/in oder Mieter/in? <span style={{ color: '#cc0000' }}>*</span>
        </label>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={rolleCardStyle('eigentuemer')} onClick={() => selectRolle('eigentuemer')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🏠</div>
            <div style={{ fontSize: 15 }}>Eigentümer/in</div>
          </div>
          <div style={rolleCardStyle('mieter')} onClick={() => selectRolle('mieter')}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔑</div>
            <div style={{ fontSize: 15 }}>Mieter/in</div>
          </div>
        </div>
      </div>

      {/* Eigentümer: Art der Nutzung */}
      {data.rolle === 'eigentuemer' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 10 }}>
            Art der Nutzung <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={artCardStyle('eigennutzung')} onClick={() => selectArt('eigennutzung')}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🏡</div>
              <div style={{ fontSize: 14 }}>Eigentum mit Eigennutzung</div>
            </div>
            <div style={artCardStyle('vermietet')} onClick={() => selectArt('vermietet')}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>
              <div style={{ fontSize: 14 }}>Eigentum mit Vermietung</div>
            </div>
          </div>
        </div>
      )}

      {/* Eigentümer + Eigennutzung: Hauptwohnsitz / Nebenwohnsitz */}
      {data.rolle === 'eigentuemer' && data.art === 'eigennutzung' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.eigennutzung_typ ? '#b91c1c' : '#374151'
          }}>
            Wohnsitzart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'hauptwohnsitz', label: 'Hauptwohnsitz' },
              { value: 'nebenwohnsitz', label: 'Nebenwohnsitz' },
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

      {/* Eigentümer + Vermietung: Vermietungsart */}
      {data.rolle === 'eigentuemer' && data.art === 'vermietet' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.vermietung_typ ? '#b91c1c' : '#374151'
          }}>
            Vermietungsart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'langzeit', label: 'Langzeitvermietung' },
              { value: 'saisonal', label: 'Saisonale Vermietung' },
              { value: 'touristisch', label: 'Touristische Vermietung' },
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

      {/* Mieter/in: Hauptwohnsitz / Nebenwohnsitz */}
      {data.rolle === 'mieter' && (
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 8,
            color: attempted && !data.mieter_typ ? '#b91c1c' : '#374151'
          }}>
            Wohnsitzart <span style={{ color: '#cc0000' }}>*</span>
          </label>
          <div className="radio-group">
            {[
              { value: 'hauptwohnsitz', label: 'Hauptwohnsitz' },
              { value: 'nebenwohnsitz', label: 'Nebenwohnsitz' },
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
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {attempted && !canNext && (
            <span style={{ fontSize: 12, color: '#b91c1c' }}>
              ⚠️ Bitte alle Pflichtfelder ausfüllen
            </span>
          )}
          <button className="btn btn-hogar" onClick={handleNext}>Weiter →</button>
        </div>
      </div>
    </div>
  );
}
