import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FormApp from './FormApp';
import HogarForm from './HogarForm';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/KFZ-Schaden/de" replace />} />
        <Route path="/KFZ-Schaden/de" element={<FormApp lang="de" />} />
        <Route path="/CAR-Accident/en" element={<FormApp lang="en" />} />
        <Route path="/Haus/de" element={<HogarForm lang="de" />} />
        <Route path="/Home/en" element={<HogarForm lang="en" />} />
        {/* Legacy redirects */}
        <Route path="/de" element={<Navigate to="/KFZ-Schaden/de" replace />} />
        <Route path="/en" element={<Navigate to="/CAR-Accident/en" replace />} />
        <Route path="/hogar" element={<Navigate to="/Haus/de" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
