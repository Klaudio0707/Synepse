import { useState } from 'react';
import { api } from '../../services/api'; // Ajuste o caminho se necessário
import { Activity, Ticket, User } from 'lucide-react';
import  type { TicketResponse } from '../../types/ITicketResponse';


export function Totem() { // Mudou de App para Totem
  const [senha, setSenha] = useState<TicketResponse | null>(null);

  const gerarSenha = async (prioridade: 'SP' | 'SG' | 'SE') => {
    try {
      const response = await api.post('/ticket', { prioridade });
      setSenha(response.data);
      setTimeout(() => setSenha(null), 5000);
    } catch (error) {
      console.error(error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const estiloBotao = (bg: string, color = '#fff') => ({
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center',
    width: '180px', height: '180px', background: bg, color: color,
    border: 'none', borderRadius: '15px', fontSize: '1.2rem', fontWeight: 'bold',
    cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5' }}>
      {!senha ? (
        <>
          <h1 style={{ marginBottom: '40px', color: '#333' }}>Retire sua Senha</h1>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => gerarSenha('SP')} style={estiloBotao('#e74c3c')}>
              <Activity size={48} /><span style={{ marginTop: '10px' }}>Prioritário</span>
            </button>
            <button onClick={() => gerarSenha('SE')} style={estiloBotao('#f1c40f', '#000')}>
              <Ticket size={48} /><span style={{ marginTop: '10px' }}>Exames</span>
            </button>
            <button onClick={() => gerarSenha('SG')} style={estiloBotao('#3498db')}>
              <User size={48} /><span style={{ marginTop: '10px' }}>Geral</span>
            </button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0, color: '#888' }}>Sua senha é:</h2>
          <h1 style={{ fontSize: '5rem', margin: '20px 0', color: '#2c3e50' }}>{senha.codigo}</h1>
          <p>Aguarde no painel.</p>
        </div>
      )}
    </div>
  );
}
