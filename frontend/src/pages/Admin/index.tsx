import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Megaphone, CheckCircle, XCircle, User, LogIn, RefreshCw, Edit2, Save, Trash2 } from 'lucide-react';
import useToast from '../../components/UseToaster'; 

interface Ticket {
  ticketId: string; // Padrão do Backend atualizado
  codigo: string;
  prioridade: string;
  status: string;
  usuarioId?: string;
  pacienteId?: string;
  paciente?: { nome: string; CPF?: string; telefone?: string; cep?: string }
}

interface Usuario {
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioSenha: string;
  role: string;
}

export function Admin() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
  
  // Login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Atendimento
  const [ticketAtual, setTicketAtual] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DO FORMULÁRIO (QUE ESTAVAM FALTANDO) ---
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");

  // Função auxiliar para exibir erros
  const exibirErro = (erro: any) => {
    const msgBackend = erro.response?.data?.message;
    let msgFinal = "Erro de conexão.";
    if (msgBackend) msgFinal = Array.isArray(msgBackend) ? msgBackend[0] : msgBackend;
    useToast(msgFinal, 'error');
  };

  useEffect(() => {
    const salvo = localStorage.getItem('synapse_user');
    if (salvo) setUsuarioLogado(JSON.parse(salvo));
  }, []);

  // Recupera sessão e preenche dados
  useEffect(() => {
    if (usuarioLogado && !ticketAtual) recuperarAtendimentoPreso();
  }, [usuarioLogado]);

  // Preenche o formulário quando o ticket muda
  useEffect(() => {
    if (ticketAtual && ticketAtual.paciente) {
      setNome(ticketAtual.paciente.nome);
      setCpf(ticketAtual.paciente.CPF || "");
      setTelefone(ticketAtual.paciente.telefone || "");
      setCep(ticketAtual.paciente.cep || "");
      
      // Se o nome for o código (ex: 251128-SP01), abre edição automático para o médico corrigir
      if (ticketAtual.paciente.nome === ticketAtual.codigo) {
        setEditando(true);
      }
    }
  }, [ticketAtual]);

  const recuperarAtendimentoPreso = async () => {
    try {
      const response = await api.get('/ticket');
      const todos: Ticket[] = response.data;
      const preso = todos.find(t => t.status === 'CHAMADO' && t.usuarioId === usuarioLogado?.usuarioId);
      if (preso) {
        setTicketAtual(preso);
        useToast("Atendimento recuperado!", 'warning');
      }
    } catch (e) { console.log('Nada preso'); }
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
        useToast(`Bem-vindo, ${user.usuarioNome}!`, 'success');
      } else {
        useToast('Credenciais inválidas', 'warning');
      }
    } catch (error) { exibirErro(error); }
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('synapse_user');
    window.dispatchEvent(new Event('loginStateChange'));
  };

const chamarProximo = async () => {
    if (!usuarioLogado) return;
    setLoading(true);
    
    // --- DEBUG: ADICIONE ISSO ---
    console.log("DADOS DO USUÁRIO LOGADO:", usuarioLogado);
    console.log("ID QUE ESTOU TENTANDO ENVIAR:", usuarioLogado.usuarioId);
    // ----------------------------

    try {
      const response = await api.patch('/ticket/chamar', {
        usuarioId: usuarioLogado.usuarioId // Verifica se isso aqui não está undefined no console
      });
      setTicketAtual(response.data);
      setEditando(true);
    } catch (error: any) {
      exibirErro(error);
    } finally {
      setLoading(false);
    }
  };

  const salvarPaciente = async () => {
    if (!ticketAtual || !ticketAtual.pacienteId) return;
    try {
      await api.patch(`/paciente/${ticketAtual.pacienteId}`, {
        nome, CPF: cpf, telefone, cep
      });
      useToast("Dados salvos!", 'success');
      // Atualiza visualmente
      setTicketAtual({ ...ticketAtual, paciente: { nome, CPF: cpf, telefone, cep } });
      setEditando(false);
    } catch (error) { exibirErro(error); }
  };

  const finalizar = async () => {
    if (!ticketAtual) return;
    try {
      await api.patch(`/ticket/${ticketAtual.ticketId}/finalizar`);
      setTicketAtual(null);
      useToast("Finalizado!", 'success');
    } catch (e) { exibirErro(e); }
  };

  const cancelar = async () => {
    if (!ticketAtual) return;
    if (!confirm("Confirmar ausência do paciente?")) return;
    try {
      await api.patch(`/ticket/${ticketAtual.ticketId}/cancelar`);
      setTicketAtual(null);
      useToast("Cancelado.", 'info');
    } catch (e) { exibirErro(e); }
  };

  const excluirTicket = async () => {
    if (!ticketAtual) return;
    if (!confirm("EXCLUIR PERMANENTEMENTE?")) return;
    try {
      await api.delete(`/ticket/${ticketAtual.ticketId}`);
      setTicketAtual(null);
      useToast("Excluído.", 'error');
    } catch (e) { exibirErro(e); }
  };

  if (!usuarioLogado) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2c3e50' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '10px', width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Acesso Restrito</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={inputStyle} required />
          <button type="submit" style={btnStyle('#2980b9')}>Entrar</button>
          <Link to="/cadastro" style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '0.9rem' }}>Criar conta</Link>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#ecf0f1', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Atendimento</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>{usuarioLogado.usuarioNome}</strong>
          <button onClick={handleLogout} style={{ ...btnStyle('#7f8c8d'), padding: '5px 10px', fontSize: '0.8rem' }}>Sair</button>
        </div>
      </div>

      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '600px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        
        {ticketAtual ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ color: '#121313ff', textTransform: 'uppercase', fontSize: '0.9rem' }}>Senha Chamada</span>
              <button onClick={excluirTicket} title="Excluir" style={{ background: 'transparent', border: 'none', color: '#c0392b', cursor: 'pointer' }}><Trash2 size={20}/></button>
            </div>

            <h1 style={{ fontSize: '5rem', margin: '10px 0', color: '#2980b9' }}>{ticketAtual.codigo}</h1>
            
            {/* --- ÁREA DO FORMULÁRIO (AGORA ESTÁ AQUI!) --- */}
            <div style={{ background: '#d4d6d8ff', padding: '20px', borderRadius: '15px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><User size={20}/> Dados do Paciente</h3>
                {!editando && <button onClick={() => setEditando(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#f39c12' }}><Edit2 size={18}/></button>}
              </div>

              {editando ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} style={{ flex: 1, ...inputStyle, marginTop: 0 }} />
                    <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} style={{ flex: 1, ...inputStyle, marginTop: 0 }} />
                  </div>
                  <input placeholder="CEP" value={cep} onChange={e => setCep(e.target.value)} style={inputStyle} />
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={salvarPaciente} style={{ ...btnStyle('#27ae60'), flex: 1 }}>Salvar Dados</button>
                    <button onClick={() => setEditando(false)} style={{ ...btnStyle('#95a5a6'), width: 'auto' }}>Cancelar Edição</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ margin: '5px 0' }}><strong>Nome:</strong> {ticketAtual.paciente?.nome}</p>
                  <p style={{ margin: '5px 0' }}><strong>CPF:</strong> {ticketAtual.paciente?.CPF || '-'}</p>
                  <p style={{ margin: '5px 0' }}><strong>Tel:</strong> {ticketAtual.paciente?.telefone || '-'}</p>
                </div>
              )}
            </div>
            {/* ------------------------------------------- */}

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={finalizar} style={{ ...btnStyle('#27ae60'), fontSize: '1.1rem', padding: '15px 30px' }}>
                <CheckCircle size={24} style={{ marginRight: '10px' }} /> Finalizar
              </button>
              <button onClick={cancelar} style={{ ...btnStyle('#c0392b'), fontSize: '1.1rem', padding: '15px 30px' }}>
                <XCircle size={24} style={{ marginRight: '10px' }} /> Ausente
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px 0' }}>
            <h2 style={{ color: '#bdc3c7', marginBottom: '30px' }}>Nenhum paciente na mesa</h2>
            <button onClick={chamarProximo} disabled={loading} style={{ ...btnStyle('#2980b9'), fontSize: '1.2rem', padding: '20px 40px', opacity: loading ? 0.7 : 1 }}>
              <Megaphone size={28} style={{ marginRight: '10px' }} /> 
              {loading ? "Buscando..." : "CHAMAR PRÓXIMO"}
            </button>
            
            <div style={{ marginTop: '20px' }}>
               <button onClick={recuperarAtendimentoPreso} style={{ background: 'transparent', border: 'none', color: '#95a5a6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', margin: '0 auto' }}>
                 <RefreshCw size={16} /> Verificar pendências
               </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #bdc3c7', fontSize: '1rem', boxSizing: 'border-box' as const, marginTop: '5px' };
const btnStyle = (bg: string) => ({ background: bg, color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' });