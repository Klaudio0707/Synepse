import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Totem } from './pages/Totem';
import { Painel } from './pages/Painel';
import { Admin } from './pages/Admin';
import { Dashboard } from './pages/Dashboard';
import { CadastroUsuario } from './pages/CadatroUsuario';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
    <Sidebar/>
    <Routes>
      <Route path="/" element={<Totem />} />
      <Route path="/painel" element={<Painel />} /> 
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cadastro" element={<CadastroUsuario />} />

    </Routes>
  </BrowserRouter>
  );
}

export default App;