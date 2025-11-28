import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Megaphone, CheckCircle, XCircle, User, LogIn, RefreshCw } from 'lucide-react';
import useToast from '../../components/UseToaster';

interface Ticket {
  ticketId: string;
  codigo: string;
  prioridade: string;
  status: string;
  usuarioId?: string; // IMPORTANTE: Precisamos saber de quem é o ticket
  paciente?: { nome: string }
}

interface Usuario {
  id: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioSenha: string;
  role: string;
}

export function Admin() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ticketAtual, setTicketAtual] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Carrega usuário do LocalStorage
  useEffect(() => {
    const salvo = localStorage.getItem('synapse_user');
    if (salvo) setUsuarioLogado(JSON.parse(salvo));
  }, []);

  // 2. NOVO: Recupera atendimento se o usuário recarregar a página
  useEffect(() => {
    if (usuarioLogado && !ticketAtual) {
      recuperarAtendimentoPreso();
    }
  }, [usuarioLogado]); // Roda toda vez que o usuário loga

  // Função que busca no banco se deixamos algo aberto
  const recuperarAtendimentoPreso = async () => {
    try {
      const response = await api.get('/ticket');
      const todos: Ticket[] = response.data;

      // Procura um ticket que esteja CHAMADO e seja MEU
      const meuTicketPreso = todos.find(t => 
        t.status === 'CHAMADO' && t.usuarioId === usuarioLogado?.id
      );

      if (meuTicketPreso) {
        setTicketAtual(meuTicketPreso);
        // Opcional: Avisar que recuperou
        // console.log("Atendimento recuperado:", meuTicketPreso.codigo);
      }
    } catch (error) {
      const mensagemBackend = error;
      const mensagemFinal = mensagemBackend || "Erro ao chamar. Verifique a conexão.";
      useToast(
        Array.isArray(mensagemFinal) ? mensagemFinal[0] : mensagemFinal, 
        'warning'
      );
     
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get('/usuario');
      const usuarios: Usuario[] = response.data;
      const user = usuarios.find(u => u.usuarioEmail === email && u.usuarioSenha === senha);

      if (user) {
        setUsuarioLogado(user);
        localStorage.setItem('synapse_user', JSON.stringify(user));
        window.dispatchEvent(new Event('loginStateChange')); 
        useToast(`Seja bem vindo ${user.usuarioNome}!`, 'success');
      } else {
       useToast('Email ou senha inválidos', 'warning');
      }
    } catch (error) {
      
      const mensagemBackend = error;
      const mensagemFinal = mensagemBackend || "Erro ao chamar. Verifique a conexão.";
      useToast(
        Array.isArray(mensagemFinal) ? mensagemFinal[0] : mensagemFinal, 
        'warning'
      );
    }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('synapse_user');
    window.dispatchEvent(new Event('loginStateChange')); 
  };

  const chamarProximo = async () => {
    if (!usuarioLogado) return;
    setLoading(true);
    try {
      const response = await api.patch('/ticket/chamar', {
        usuarioId: usuarioLogado.id
      });
      setTicketAtual(response.data);
    } catch (error: any) {
   
      const mensagemBackend = error.response?.data?.message;
      
      // 2. Se não tiver mensagem no Backend, usa uma genérica
      const mensagemFinal = mensagemBackend || "Erro ao chamar. Verifique a conexão.";

      // 3. Exibe no Toast (Se a mensagem for um Array, pega a primeira linha)
      useToast(
        Array.isArray(mensagemFinal) ? mensagemFinal[0] : mensagemFinal, 
        'warning'
      );
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

  // --- RENDER ---
  if (!usuarioLogado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#2c3e50' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '10px', width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Acesso Restrito</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} required />
          <button type="submit" style={estiloBotao('#2980b9', '#fff', true)}><LogIn size={20} /> Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', background: '#ecf0f1', fontFamily: 'sans-serif', padding: '50px' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Painel do Atendente</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Olá, <strong>{usuarioLogado.usuarioNome}</strong></span>
          <button onClick={handleLogout} style={{ background: '#7f8c8d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '400px', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {ticketAtual ? (
          <>
            <span style={{ color: '#7f8c8d', fontSize: '1.2rem' }}>Atendendo agora:</span>
            <h1 style={{ fontSize: '4rem', margin: '20px 0', color: '#2980b9' }}>{ticketAtual.codigo}</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#555', marginBottom: '30px' }}><User /><strong>{ticketAtual.paciente?.nome || "Anônimo"}</strong></div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={finalizar} style={estiloBotao('#27ae60')}><CheckCircle size={20} /> Finalizar</button>
              <button onClick={cancelar} style={estiloBotao('#c0392b')}><XCircle size={20} /> Cancelar</button>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ color: '#bdc3c7' }}>Nenhum atendimento</h2>
            <div style={{ marginTop: '30px' }}>
              <button onClick={chamarProximo} disabled={loading} style={estiloBotao('#2980b9', '#fff', true)}><Megaphone size={24} /> {loading ? "Chamando..." : "CHAMAR PRÓXIMO"}</button>
            </div>
            
            {/* Botão de Emergência caso a automação falhe */}
            <div style={{ marginTop: '20px' }}>
               <button onClick={recuperarAtendimentoPreso} style={{ background: 'transparent', border: 'none', color: '#95a5a6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}>
                 <RefreshCw size={16} /> Verificar pendências
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const estiloBotao = (bg: string, color = '#fff', grande = false) => ({ background: bg, color: color, border: 'none', padding: grande ? '15px' : '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.9, transition: '0.2s', width: grande ? '100%' : 'auto' });