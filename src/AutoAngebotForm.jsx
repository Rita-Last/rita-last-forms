import { useState, useEffect } from 'react';
import StepAutoPersonal from './steps/auto/StepAutoPersonal';
import StepAutoFahrzeug from './steps/auto/StepAutoFahrzeug';
import StepAutoSummary from './steps/auto/StepAutoSummary';
import './App.css';

const STORAGE_KEY = 'rita-auto-form';

const INITIAL_DATA = {
  personal: {
    vorname: '', nachname: '', nie: '', geburtsdatum: '', email: '',
    strasse: '', plz: '', ort: '', nationalitaet: '',
    fuehrerschein_datum: '',
    unfallfrei: '', unfallfrei_info: '',
    fahrer_unter_25: '', fahrer_unter_25_info: '',
  },
  fahrzeug: {
    marke: '', modell: '', version: '', ps: '',
    kraftstoff: '', tueren: '', baujahr: '', kennzeichen: '',
    extras: '', extras_info: '',
    privat_nutzung: '', privat_nutzung_info: '',
  },
};

const STEPS = {
  de: [
    { id: 'personal', label: 'Persönliche Daten', icon: '👤' },
    { id: 'fahrzeug', label: 'Fahrzeug-Daten', icon: '🚗' },
    { id: 'summary', label: 'Zusammenfassung', icon: '✅' },
  ],
  en: [
    { id: 'personal', label: 'Personal Data', icon: '👤' },
    { id: 'fahrzeug', label: 'Vehicle Data', icon: '🚗' },
    { id: 'summary', label: 'Summary', icon: '✅' },
  ],
};

function stepStatus(formData, idx) {
  const { personal, fahrzeug } = formData;
  if (idx === 0) {
    const required = [
      personal.vorname, personal.nachname, personal.nie, personal.geburtsdatum,
      personal.email, personal.plz, personal.ort, personal.nationalitaet,
      personal.fuehrerschein_datum, personal.unfallfrei, personal.fahrer_unter_25,
    ];
    const filled = required.filter(Boolean).length;
    return filled === required.length ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 1) {
    const required = [
      fahrzeug.marke, fahrzeug.modell, fahrzeug.version, fahrzeug.ps,
      fahrzeug.kraftstoff, fahrzeug.tueren, fahrzeug.baujahr, fahrzeug.kennzeichen,
      fahrzeug.extras, fahrzeug.privat_nutzung,
    ];
    const filled = required.filter(Boolean).length;
    return filled === required.length ? 'done' : filled > 0 ? 'partial' : 'empty';
  }
  if (idx === 2) {
    return [0, 1].every(i => stepStatus(formData, i) === 'done') ? 'done' : 'empty';
  }
  return 'empty';
}

export default function AutoAngebotForm({ lang = 'de' }) {
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
        setFormData(JSON.parse(saved));
        setDraftLoaded(true);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch { /* ignore */ }
  }, [formData]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_DATA);
    setDraftLoaded(false);
    setCurrentStep(0);
  };

  const updateSection = (section, patch) => {
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const steps = STEPS[lang] || STEPS.de;
  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/auto-angebot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, honeypot, lang }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
      } else {
        setSubmitError(json.message || 'Ein unbekannter Fehler ist aufgetreten.');
      }
    } catch {
      setSubmitError(lang === 'en' ? 'Connection error. Please try again.' : 'Verbindungsfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = steps.map((_, i) => stepStatus(formData, i));
  const statusIcon = (s) => s === 'done' ? '✓' : s === 'partial' ? '⚠' : null;
  const statusColor = (s, isActive) => {
    if (isActive) return '#9B2035';
    if (s === 'done') return '#9B2035';
    if (s === 'partial') return '#f59e0b';
    return '#9ca3af';
  };

  if (submitted) {
    return (
      <div className="app-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2 style={{ color: '#9B2035' }}>{lang === 'en' ? 'Thank you!' : 'Vielen Dank!'}</h2>
          <p>{lang === 'en' ? 'Rita will get back to you within 24 hours.' : 'Rita meldet sich innerhalb von 24 Stunden bei Ihnen.'}</p>
        </div>
      </div>
    );
  }

  const stepComponents = [
    <StepAutoPersonal
      key="personal"
      data={formData.personal}
      onChange={patch => updateSection('personal', patch)}
      onNext={next}
      lang={lang}
    />,
    <StepAutoFahrzeug
      key="fahrzeug"
      data={formData.fahrzeug}
      onChange={patch => updateSection('fahrzeug', patch)}
      onNext={next}
      onPrev={prev}
      lang={lang}
    />,
    <StepAutoSummary
      key="summary"
      formData={formData}
      onPrev={prev}
      onSubmit={handleSubmit}
      submitError={submitError}
      submitting={submitting}
      datenschutz={datenschutz}
      onDatenschutz={setDatenschutz}
      lang={lang}
    />,
  ];

  return (
    <div className="app-container">
      <input type="text" name="website" value={honeypot} onChange={e => setHoneypot(e.target.value)}
        style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      <header className="app-header">
        <img src="/logo.png" alt="Rita Last Insurance" style={{ height: 52 }} />
        <span style={{ fontSize: 13, color: '#5a5a72', fontWeight: 500 }}>
          {lang === 'en' ? 'Car Insurance – Quote Request' : 'Autoversicherung – Angebotsanfrage'}
        </span>
      </header>

      {draftLoaded && (
        <div style={{
          background: '#fdf8f8', border: '1px solid #d4829a', borderRadius: 8,
          padding: '10px 16px', marginBottom: 16, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ color: '#9B2035' }}>💾 {lang === 'en' ? 'Draft loaded' : 'Gespeicherter Entwurf geladen'}</span>
          <button onClick={clearDraft} style={{
            background: 'none', border: '1px solid #d4829a', borderRadius: 6,
            padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#9B2035',
          }}>
            {lang === 'en' ? 'Delete draft' : 'Entwurf löschen'}
          </button>
        </div>
      )}

      <nav className="step-nav">
        {steps.map((step, i) => {
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
