import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Totem } from './pages/Totem';
import { Painel } from './pages/Painel';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Totem />} />
      <Route path="/painel" element={<Painel />} /> 
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;