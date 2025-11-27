import { useState } from 'react';
import { api } from '../../services/api';
import { UserPlus, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CadastroUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuarioNome: '',
    usuarioEmail: '',
    usuarioSenha: '',
    role: 'ATENDENTE'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/usuario', formData);
      alert('Usuário cadastrado com sucesso!');
      navigate('/admin'); // Volta para o login/admin
    } catch (error: any) {
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || 'Erro desconhecido'));
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ecf0f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '15px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#2c3e50' }}>
          <UserPlus size={32} />
          <h2 style={{ margin: 0 }}>Novo Usuário</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label>
            <strong>Nome Completo</strong>
            <input name="usuarioNome" placeholder='Nome' required onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            <strong>Email</strong>
            <input name="usuarioEmail" placeholder='Email' type="email" required onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            <strong>Senha</strong>
            <input name="usuarioSenha" placeholder='Senha' type="password" minLength={6} required onChange={handleChange} style={inputStyle} />
          </label>

          <label>
            <strong>Perfil</strong>
            <select name="role" onChange={handleChange} style={inputStyle}>
              <option value="ATENDENTE">Atendente</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <button type="submit" style={buttonStyle('#27ae60')}>
            <Save size={20} /> Salvar Usuário
          </button>

          <button type="button" onClick={() => navigate('/admin')} style={buttonStyle('#95a5a6')}>
            <ArrowLeft size={20} /> Voltar
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' };
const buttonStyle = (bg: string) => ({
  background: bg, color: 'white', border: 'none', padding: '12px', borderRadius: '8px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  fontWeight: 'bold' as const, fontSize: '1rem'
});