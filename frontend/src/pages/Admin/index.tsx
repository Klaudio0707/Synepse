import { useState } from 'react';
import { api } from '../../services/api';
import { Megaphone, CheckCircle, XCircle, User, LogIn } from 'lucide-react';
import { data } from 'react-router-dom';

interface Ticket {
  ticketId: string;
  codigo: string;
  prioridade: string;
  status: string;
  paciente?: { nome: string }
}

interface Usuario {
  id: string; // O UUID que precisamos
  usuarioNome: string;
  usuarioEmail: string;
  usuarioSenha: string;
  role: string;
}

export function Admin() {
  // Estado para guardar o usuário logado
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  
  // Estados do Formulário de Login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Estados do Painel
  const [ticketAtual, setTicketAtual] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  // --- FUNÇÃO DE LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Truque do Modo de Guerra: Baixa todos e procura o usuário localmente
      const response = await api.get('/usuario');
      const usuarios: Usuario[] = response.data;
      console.log(usuarios)
      const user = usuarios.find(u => u.usuarioEmail === email && u.usuarioSenha === senha);

      if (user) {
        setUsuarioLogado(user); // Salva o usuário (e o ID dele!)
        alert(`Bem-vindo, ${user.usuarioNome}!`);
      } else {
        alert("Email ou senha inválidos!");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  // --- FUNÇÕES DO PAINEL ---
  
  const chamarProximo = async () => {
    if (!usuarioLogado) return;
    setLoading(true);
    try {
      const response = await api.patch('/ticket/chamar', {
        id: usuarioLogado.id // <--- USA O ID DINÂMICO AQUI
      });
      setTicketAtual(response.data);
    } catch (error: any) {
      const mensagem = error.response?.data?.message || "Erro ao chamar!\n A fila está vazia!";
      alert(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const finalizar = async () => {
    if (!ticketAtual) return;
    try {
      await api.patch(`/ticket/${ticketAtual.ticketId}/finalizar`);
      setTicketAtual(null);
      alert("Atendimento finalizado!");
    } catch (error) {
      alert("Erro ao finalizar.");
    }
  };

  const cancelar = async () => {
    if (!ticketAtual) return;
    if (!confirm("Cancelar esta senha?")) return;
    try {
      await api.patch(`/ticket/${ticketAtual.ticketId}/cancelar`);
      setTicketAtual(null);
    } catch (error) {
      alert("Erro ao cancelar.");
    }
  };

  // --- RENDERIZAÇÃO CONDICIONAL ---

  // 1. Se não estiver logado, mostra TELA DE LOGIN
  if (!usuarioLogado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#2c3e50' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '10px', width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Acesso Restrito</h2>
          
          <input 
            type="email" 
            placeholder="Seu Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />
          
          <input 
            type="password" 
            placeholder="Sua Senha" 
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            required
          />

          <button type="submit" style={estiloBotao('#2980b9', '#fff', true)}>
            <LogIn size={20} /> Entrar
          </button>
        </form>
      </div>
    );
  }

  // 2. Se estiver logado, mostra O PAINEL DE CONTROLE
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', background: '#ecf0f1', fontFamily: 'sans-serif', padding: '50px' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Painel do Atendente</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Olá, <strong>{usuarioLogado.usuarioNome}</strong></span>
          <button onClick={() => setUsuarioLogado(null)} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ 
        background: 'white', padding: '40px', borderRadius: '20px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '400px', minHeight: '300px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        
        {ticketAtual ? (
          <>
            <span style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>Atendendo agora:</span>
            <h1 style={{ fontSize: '4rem', margin: '20px 0', color: '#2980b9' }}>{ticketAtual.codigo}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#555', marginBottom: '30px' }}>
              <User />
              <strong>{ticketAtual.paciente?.nome || "Anônimo"}</strong>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={finalizar} style={estiloBotao('#27ae60')}>
                <CheckCircle size={20} /> Finalizar
              </button>
              <button onClick={cancelar} style={estiloBotao('#c0392b')}>
                <XCircle size={20} /> Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ color: '#bdc3c7' }}>Nenhum atendimento</h2>
            <div style={{ marginTop: '30px' }}>
              <button onClick={chamarProximo} disabled={loading} style={estiloBotao('#2980b9', '#fff', true)}>
                <Megaphone size={24} /> 
                {loading ? "Chamando..." : "CHAMAR PRÓXIMO"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

const estiloBotao = (bg: string, color = '#fff', grande = false) => ({
  background: bg, color: color, border: 'none', padding: grande ? '15px' : '10px 20px',
  borderRadius: '8px', cursor: 'pointer', fontSize: '1rem',
  fontWeight: 'bold' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  opacity: 0.9, transition: '0.2s', width: grande ? '100%' : 'auto'
});