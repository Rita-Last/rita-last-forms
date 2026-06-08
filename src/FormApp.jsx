import { useState, useEffect } from 'react';
import de from './translations/de';
import en from './translations/en';
import ProgressBar from './components/ProgressBar';
import StepPersonal from './steps/StepPersonal';
import StepFahrzeug from './steps/StepFahrzeug';
import StepSchadensart from './steps/StepSchadensart';
import StepScheibe from './steps/StepScheibe';
import StepUnfall from './steps/StepUnfall';
import StepDiebstahl from './steps/StepDiebstahl';
import StepSummary from './steps/StepSummary';
import './App.css';

const INITIAL_DATA = {
  personal: { vorname: '', nachname: '', email: '', telefon: '', strasse: '', plz: '', ort: '', police_nr: '' },
  fahrzeug: { kennzeichen: '', marke: '' },
  schadensart: '',
  scheibe: { reparatur: '', datum: '', beschreibung: '' },
  unfall: {
    fahrer_ist_vn: '',
    fahrer_name: '',
    fuehrerschein_vorne: null,
    fuehrerschein_hinten: null,
    nie_dokument: null,
    datum: '', uhrzeit: '', schuld: '',
    ort_strasse: '', ort_plz: '', ort_ort: '',
    hergang: '',
    unfallbogen: '', unfallbogen_bild: null,
    polizei: '', polizei_bericht: null,
    zeugen: '', zeugen_info: '',
  },
  eigenSchaden: {
    beschreibung: '',
    bilder: [],
    werkstatt: '',
    werkstatt_name: '',
    werkstatt_tel: '',
    werkstatt_strasse: '',
    werkstatt_plz: '',
    werkstatt_ort: '',
    gutachter_termin: '',
  },
  gegner: {
    kennzeichen: '', land: '', marke_modell: '', farbe: '',
    versicherung: '', police_nr: '',
    fahrer_name: '', geburtsdatum: '', fuehrerschein_datum: '',
    ist_inhaber: '',
  },
  gegnerSchaden: { beschreibung: '', bilder: [] },
  personenschaden: { hat_schaden: '', beschreibung: '', arztbericht: null },
  diebstahl: { polizei_bericht: null },
};

// Steps: 0=personal, 1=fahrzeug, 2=schadensart, 3=details, 4=summary
const STEP_IDS = ['personal', 'fahrzeug', 'schadensart', 'details', 'summary'];

function computeStepStatus(formData) {
  const { personal, fahrzeug, schadensart, scheibe, unfall, eigenSchaden, gegner, gegnerSchaden, personenschaden, diebstahl } = formData;

  // Personal
  const personalFields = ['vorname', 'nachname', 'email', 'telefon', 'strasse', 'plz', 'ort'];
  const personalFilled = personalFields.filter(k => personal[k]).length;
  const personalStatus = personalFilled === personalFields.length ? 'done' : personalFilled > 0 ? 'partial' : 'empty';

  // Fahrzeug
  const fahrzeugFilled = [fahrzeug.kennzeichen, fahrzeug.marke].filter(Boolean).length;
  const fahrzeugStatus = fahrzeugFilled === 2 ? 'done' : fahrzeugFilled > 0 ? 'partial' : 'empty';

  // Schadensart
  const schadensartStatus = schadensart ? 'done' : 'empty';

  // Details
  let detailsDone = false;
  let detailsPartial = false;
  if (schadensart === 'scheibe') {
    detailsDone = !!(scheibe.reparatur && scheibe.beschreibung);
    detailsPartial = !!(scheibe.reparatur || scheibe.beschreibung);
  } else if (schadensart === 'unfall_gegner' || schadensart === 'unfall_eigen') {
    const fahrer_ist_vn = unfall.fahrer_ist_vn;
    const fahrerFieldsOk = fahrer_ist_vn === 'ja' ||
      (fahrer_ist_vn === 'nein' && unfall.fahrer_name && unfall.fuehrerschein_vorne && unfall.fuehrerschein_hinten && unfall.nie_dokument);
    const required = [
      fahrer_ist_vn,
      unfall.datum,
      ...(schadensart === 'unfall_gegner' ? [unfall.schuld] : []),
      unfall.ort_strasse, unfall.ort_plz, unfall.ort_ort,
      unfall.hergang,
      ...(schadensart === 'unfall_gegner' ? [unfall.unfallbogen] : []),
      unfall.polizei, unfall.zeugen,
      eigenSchaden.beschreibung, eigenSchaden.werkstatt,
      personenschaden.hat_schaden,
    ];
    const werkstattExtra = eigenSchaden.werkstatt === 'eigen'
      ? [eigenSchaden.werkstatt_name, eigenSchaden.werkstatt_tel, eigenSchaden.werkstatt_strasse, eigenSchaden.werkstatt_plz, eigenSchaden.werkstatt_ort, eigenSchaden.gutachter_termin]
      : [];
    const personenExtra = personenschaden.hat_schaden === 'ja'
      ? [personenschaden.beschreibung]
      : [];
    const gegnerExtra = schadensart === 'unfall_gegner'
      ? [gegner.kennzeichen, gegner.land, gegner.marke_modell, gegner.ist_inhaber, gegnerSchaden.beschreibung]
      : [];
    const filledCount = [...required, ...werkstattExtra, ...personenExtra, ...gegnerExtra].filter(Boolean).length;
    const totalCount = required.length + werkstattExtra.length + personenExtra.length + gegnerExtra.length;
    detailsDone = filledCount === totalCount && !!fahrerFieldsOk && eigenSchaden.bilder && eigenSchaden.bilder.length > 0;
    detailsPartial = filledCount > 0;
  } else if (schadensart === 'diebstahl') {
    detailsDone = !!(diebstahl && diebstahl.polizei_bericht);
    detailsPartial = false;
  }
  const detailsStatus = detailsDone ? 'done' : detailsPartial ? 'partial' : 'empty';

  const allDone = personalStatus === 'done' && fahrzeugStatus === 'done' && schadensartStatus === 'done' && detailsDone;
  const summaryStatus = allDone ? 'done' : 'empty';

  return [personalStatus, fahrzeugStatus, schadensartStatus, detailsStatus, summaryStatus];
}

function computeProgress(statuses) {
  const done = statuses.filter(s => s === 'done').length;
  return Math.round((done / statuses.length) * 100);
}

export default function FormApp({ lang }) {
  const t = lang === 'en' ? en : de;
  const STORAGE_KEY = `rita-kfz-form-${lang}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [datenschutz, setDatenschutz] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Load from localStorage on mount
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
  }, [STORAGE_KEY]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData, STORAGE_KEY]);

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData(INITIAL_DATA);
    setDraftLoaded(false);
    setCurrentStep(0);
  };

  const updateFormData = (patch) => {
    setFormData(prev => ({ ...prev, ...patch }));
  };

  const statuses = computeStepStatus(formData);
  const progress = computeProgress(statuses);
  const isComplete = statuses.slice(0, 4).every(s => s === 'done');

  const steps = [
    { id: 'personal', label: t.steps.personal, icon: '👤' },
    { id: 'fahrzeug', label: t.steps.fahrzeug, icon: '🚗' },
    { id: 'schadensart', label: t.steps.schadensart, icon: '📋' },
    { id: 'details', label: t.steps.details, icon: '📝' },
    { id: 'summary', label: t.steps.summary, icon: '✅' },
  ];

  const next = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, honeypot, lang }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.removeItem(STORAGE_KEY);
        setSubmitted(true);
      } else {
        setSubmitError(json.message || t.errors.unknown);
      }
    } catch {
      setSubmitError(t.errors.connection);
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2>{t.success.title}</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{t.success.message}</p>
        </div>
      </div>
    );
  }

  const renderDetails = () => {
    const { schadensart, scheibe, unfall, eigenSchaden, gegner, gegnerSchaden, personenschaden, diebstahl } = formData;

    if (!schadensart) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af', fontSize: 15 }}>
          {lang === 'de' ? 'Bitte wählen Sie zuerst eine Schadensart aus.' : 'Please select a type of damage first.'}
        </div>
      );
    }

    if (schadensart === 'scheibe') {
      return (
        <StepScheibe
          data={scheibe}
          onChange={(d) => updateFormData({ scheibe: d })}
          onNext={next}
          onPrev={prev}
          t={t}
        />
      );
    }

    if (schadensart === 'unfall_gegner' || schadensart === 'unfall_eigen') {
      return (
        <StepUnfall
          schadensart={schadensart}
          unfall={unfall}
          eigenSchaden={eigenSchaden}
          gegner={gegner}
          gegnerSchaden={gegnerSchaden}
          personenschaden={personenschaden}
          onChange={updateFormData}
          onNext={next}
          onPrev={prev}
          t={t}
        />
      );
    }

    if (schadensart === 'diebstahl') {
      return (
        <StepDiebstahl
          data={diebstahl}
          onChange={(d) => updateFormData({ diebstahl: d })}
          onNext={next}
          onPrev={prev}
          t={t}
        />
      );
    }

    return null;
  };

  const stepComponents = [
    <StepPersonal
      data={formData.personal}
      onChange={(d) => updateFormData({ personal: { ...formData.personal, ...d } })}
      onNext={next}
      t={t}
    />,
    <StepFahrzeug
      data={formData.fahrzeug}
      onChange={(d) => updateFormData({ fahrzeug: { ...formData.fahrzeug, ...d } })}
      onNext={next}
      onPrev={prev}
      t={t}
    />,
    <StepSchadensart
      value={formData.schadensart}
      onChange={(v) => updateFormData({ schadensart: v })}
      onNext={next}
      onPrev={prev}
      t={t}
    />,
    renderDetails(),
    <StepSummary
      formData={formData}
      onPrev={prev}
      onSubmit={handleSubmit}
      submitError={submitError}
      submitting={submitting}
      isComplete={isComplete}
      progress={progress}
      honeypot={honeypot}
      onHoneypot={setHoneypot}
      datenschutz={datenschutz}
      onDatenschutz={setDatenschutz}
      t={t}
    />,
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/logo.png" alt="Rita Last Insurance" style={{ height: 52 }} />
        <span style={{ fontSize: 13, color: '#5a5a72', fontWeight: 500 }}>
          {lang === 'de' ? 'KFZ-Schadensmeldung' : 'Car Accident Claim Report'}
        </span>
      </header>

      {draftLoaded && (
        <div style={{
          background: '#fdf8f8', border: '1px solid #d4829a', borderRadius: 8,
          padding: '10px 16px', marginBottom: 16, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <span style={{ color: '#9B2035' }}>💾 {t.draft.notice}</span>
          <button
            onClick={clearDraft}
            style={{ background: 'none', border: '1px solid #d4829a', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#9B2035' }}
          >
            {t.draft.clear}
          </button>
        </div>
      )}

      <ProgressBar progress={progress} t={t} />

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
              style={{ cursor: 'pointer' }}
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
