import { useState } from 'react';
import FileUpload from '../components/FileUpload';

export default function StepDiebstahl({ data, onChange, onNext, onPrev, t }) {
  const s = t.diebstahl;
  const [attempted, setAttempted] = useState(false);

  const canNext = !!(data.polizei_bericht);

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
      <h2 className="step-title">{s.title}</h2>

      <div style={{
        background: '#fef2f2',
        border: '1px solid #fca5a5',
        borderRadius: 8,
        padding: '14px 16px',
        marginBottom: 24,
        fontSize: 14,
        color: '#991b1b',
        fontWeight: 600,
      }}>
        {s.warning}
      </div>

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
            {!data.polizei_bericht && <li>Bitte Polizeibericht hochladen</li>}
          </ul>
        </div>
      )}

      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: '#374151' }}>
          {s.polizei_bericht_label} <span style={{ color: '#ef4444' }}>*</span>
        </div>
        <FileUpload
          value={data.polizei_bericht}
          onChange={(v) => onChange({ ...data, polizei_bericht: v })}
          t={t}
        />
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
