import { useState, useEffect } from 'react';
import StepHogarPersonal from './steps/hogar/StepHogarPersonal';
import StepHogarObjekt from './steps/hogar/StepHogarObjekt';
import StepHogarNutzung from './steps/hogar/StepHogarNutzung';
import StepHogarWerte from './steps/hogar/StepHogarWerte';
import StepHogarSummary from './steps/hogar/StepHogarSummary';
import './App.css';

const STORAGE_KEY = 'rita-hogar-form';

const INITIAL_DATA = {
  personal: { vorname: '', nachname: '', nie: '', geburtsdatum: '', email: '' },
  adresse: { strasse: '', plz: '', ort: '' },
  objekt: {
    typ: '',
    wohnung_lage: '',
    haus_art: '',
    baujahr: '',
    saniert: '',
    saniert_jahr: '',
    kataster: '',
  },
  nutzung: {
    art: '',
    eigennutzung_typ: '',
    vermietung_typ: '',
  },
  flaechen: {
    bebaute_flaeche: '',
    weitere_flaechen: '',
  },
  werte: {
    wiederaufbauwert: '',
    wiederbeschaffungswert: '',
    wertgegenstaende: '',
  },
};

const STEPS = [
  { id: 'personal', label: 'Persönliche Daten', icon: '👤' },
  { id: 'objekt', label: 'Objekt', icon: '🏠' },
  { id: 'nutzung', label: 'Nutzung & Flächen', icon: '🏡' },
  { id: 'werte', label: 'Werte', icon: '💰' },
  { id: 'summary', label: 'Zusammenfassung', icon: '✅' },
];

function stepStatus(formData, idx) {
  const { personal, adresse, objekt, nutzung, flaechen, werte } = formData;

  if (idx === 0) {
    const required = [personal.vorname, personal.nachname, personal.nie, personal.geburtsdatum, personal.email, adresse.plz, adresse.ort];
    const filled = required.filter(Boolean).length;
    return filled === required.length ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 1) {
    const base = [objekt.typ, objekt.baujahr, objekt.saniert];
    const sub = objekt.typ === 'wohnung' ? [objekt.wohnung_lage] : objekt.typ === 'haus' ? [objekt.haus_art] : [];
    const sanJahr = objekt.saniert === 'ja' ? [objekt.saniert_jahr] : [];
    const required = [...base, ...sub, ...sanJahr];
    const filled = required.filter(Boolean).length;
    return filled === required.length && required.length > 0 ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 2) {
    const sub = nutzung.art === 'eigennutzung' ? [nutzung.eigennutzung_typ] : nutzung.art === 'vermietet' ? [nutzung.vermietung_typ] : [];
    const required = [nutzung.art, ...sub, flaechen.bebaute_flaeche, flaechen.weitere_flaechen];
    const filled = required.filter(Boolean).length;
    return filled === required.length && required.length > 0 ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 3) {
    const required = [werte.wiederaufbauwert, werte.wiederbeschaffungswert, werte.wertgegenstaende];
    const filled = required.filter(Boolean).length;
    return filled === required.length ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 4) {
    return [0, 1, 2, 3].every(i => stepStatus(formData, i) === 'done') ? 'done' : 'empty';
  }
  return 'empty';
}

export default function HogarForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [datenschutz, setDatenschutz] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        setDraftLoaded(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_DATA);
    setDraftLoaded(false);
    setCurrentStep(0);
  };

  const updateSection = (section, patch) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));
  };

  const next = () => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/hogar-anfrage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, honeypot }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
      } else {
        setSubmitError(json.message || 'Ein unbekannter Fehler ist aufgetreten.');
      }
    } catch {
      setSubmitError('Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = STEPS.map((_, i) => stepStatus(formData, i));

  const statusIcon = (status) => {
    if (status === 'done') return '✓';
    if (status === 'partial') return '⚠';
    return null;
  };

  const statusColor = (status, isActive) => {
    if (isActive) return '#9B2035';
    if (status === 'done') return '#9B2035';
    if (status === 'partial') return '#f59e0b';
    return '#9ca3af';
  };

  if (submitted) {
    return (
      <div className="app-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2 style={{ color: '#9B2035' }}>Vielen Dank!</h2>
          <p>Rita meldet sich innerhalb von 24 Stunden bei Ihnen.</p>
        </div>
      </div>
    );
  }

  const honeypotField = (
    <input
      type="text"
      name="website"
      value={honeypot}
      onChange={e => setHoneypot(e.target.value)}
      style={{ display: 'none' }}
      tabIndex={-1}
      autoComplete="off"
    />
  );

  const stepComponents = [
    <StepHogarPersonal
      key="personal"
      data={formData.personal}
      adresse={formData.adresse}
      onChange={patch => updateSection('personal', patch)}
      onChangeAdresse={patch => updateSection('adresse', patch)}
      onNext={next}
    />,
    <StepHogarObjekt
      key="objekt"
      data={formData.objekt}
      onChange={patch => updateSection('objekt', patch)}
      onNext={next}
      onPrev={prev}
    />,
    <StepHogarNutzung
      key="nutzung"
      data={formData.nutzung}
      flaechen={formData.flaechen}
      onChange={patch => updateSection('nutzung', patch)}
      onChangeFlaechen={patch => updateSection('flaechen', patch)}
      onNext={next}
      onPrev={prev}
    />,
    <StepHogarWerte
      key="werte"
      data={formData.werte}
      onChange={patch => updateSection('werte', patch)}
      onNext={next}
      onPrev={prev}
    />,
    <StepHogarSummary
      key="summary"
      formData={formData}
      onPrev={prev}
      onSubmit={handleSubmit}
      submitError={submitError}
      submitting={submitting}
      datenschutz={datenschutz}
      onDatenschutz={setDatenschutz}
    />,
  ];

  return (
    <div className="app-container">
      {honeypotField}

      <header className="app-header">
        <img src="/logo.png" alt="Rita Last Insurance" style={{ height: 52 }} />
        <span style={{ fontSize: 13, color: '#5a5a72', fontWeight: 500 }}>
          Hausversicherung – Angebotsanfrage
        </span>
      </header>

      {draftLoaded && (
        <div style={{
          background: '#fdf8f8', border: '1px solid #d4829a', borderRadius: 8,
          padding: '10px 16px', marginBottom: 16, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ color: '#9B2035' }}>💾 Gespeicherter Entwurf geladen</span>
          <button
            onClick={clearDraft}
            style={{
              background: 'none', border: '1px solid #d4829a', borderRadius: 6,
              padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#9B2035',
            }}
          >
            Entwurf löschen
          </button>
        </div>
      )}

      <nav className="step-nav">
        {STEPS.map((step, i) => {
          const status = statuses[i];
          const isActive = i === currentStep;
          const icon = statusIcon(status);
          return (
            <div
              key={step.id}
              className={`step-item ${isActive ? 'active' : ''} ${status === 'done' ? 'done' : ''}`}
              onClick={() => setCurrentStep(i)}
              style={{
                cursor: 'pointer',
                ...(isActive ? { borderColor: '#9B2035', background: '#fdf8f8', color: '#9B2035' } : {}),
              }}
            >
              <span className="step-icon" style={{ color: icon ? statusColor(status, isActive) : undefined }}>
                {icon || step.icon}
              </span>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </nav>

      <main className="form-card">
        {stepComponents[currentStep]}
      </main>
    </div>
  );
}
