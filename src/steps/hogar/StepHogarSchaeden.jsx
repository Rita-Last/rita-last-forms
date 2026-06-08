import Field from '../../components/Field';

export default function StepHogarSchaeden({ data, onChange, onNext, onPrev }) {
  const canNext = data.vorschaeden && data.bestehende_versicherung;

  return (
    <div>
      <h2 className="step-title">Schadenshistorie & Versicherung</h2>
      <p className="step-subtitle">Angaben zu Vorschäden und bestehender Versicherung.</p>

      <div style={{ marginBottom: 20 }}>
        <Field label="Vorschäden in den letzten 3 Jahren?" required>
          <div className="radio-group">
            {['Ja', 'Nein'].map(v => (
              <label key={v} className="radio-option hogar">
                <input
                  type="radio"
                  name="vorschaeden"
                  value={v}
                  checked={data.vorschaeden === v}
                  onChange={() => onChange({ vorschaeden: v })}
                />
                {v}
              </label>
            ))}
          </div>
        </Field>
      </div>

      {data.vorschaeden === 'Ja' && (
        <div style={{ marginBottom: 20 }}>
          <Field label="Bitte beschreiben Sie die Vorschäden" full>
            <textarea
              placeholder="Beschreibung der Vorschäden..."
              value={data.vorschaeden_beschreibung || ''}
              onChange={e => onChange({ vorschaeden_beschreibung: e.target.value })}
              className={data.vorschaeden_beschreibung ? 'filled' : ''}
              rows={4}
            />
          </Field>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <Field label="Bestehende Versicherung?" required>
          <div className="radio-group">
            {[
              { value: 'nein', label: 'Nein (Erstversicherung)' },
              { value: 'ja', label: 'Ja, möchte wechseln' },
            ].map(opt => (
              <label key={opt.value} className="radio-option hogar">
                <input
                  type="radio"
                  name="bestehende_versicherung"
                  value={opt.value}
                  checked={data.bestehende_versicherung === opt.value}
                  onChange={() => onChange({ bestehende_versicherung: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div>
        <Field label="Gewünschter Versicherungsbeginn" optional>
          <input
            type="date"
            value={data.versicherungsbeginn || ''}
            onChange={e => onChange({ versicherungsbeginn: e.target.value })}
            className={data.versicherungsbeginn ? 'filled' : ''}
          />
        </Field>
      </div>

      <div className="step-nav-buttons">
        <button className="btn btn-secondary" onClick={onPrev}>← Zurück</button>
        <button className="btn btn-hogar" onClick={onNext} disabled={!canNext}>Weiter →</button>
      </div>
    </div>
  );
}
