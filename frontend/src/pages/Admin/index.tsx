import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../config/api';
import { Megaphone, CheckCircle, XCircle, User, LogIn, RefreshCw, Edit2, Save, Trash2, Ticket } from 'lucide-react';
import useToast from '../../components/UseToaster';
import styles from './Admin.module.css';
import type { ITicket } from '../../types/ITicket';
import type { IUsuario } from '../../types/IUsuario';
import TicketService from '../../services/Ticket.service';

export enum  OpcoesTicket {
  CHAMAR = 'chamar',
  CANCELAR = 'cancelar',
  FINALIZAR = 'finalizar',
  DELETAR = 'deletar',
}

export function Admin() {
  const [usuarioLogado, setUsuarioLogado] = useState<IUsuario | null>(null);

  // Login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // Atendimento
  const [ticketAtual, setTicketAtual] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DO FORMULÁRIO 
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
      setCep(ticketAtual.paciente.CEP || "");

      // Se o nome for o código (ex: 251128-SP01), abre edição automático para o médico corrigir
      if (ticketAtual.paciente.nome === ticketAtual.codigo) {
        setEditando(true);
      }
    }
  }, [ticketAtual]);

  // OK 
  const recuperarAtendimentoPreso = async () => {
    try {
      const ticket = await TicketService.get(); // service 
      const preso = ticket.find(t => t.status === 'CHAMADO' && t.usuario === usuarioLogado?.usuarioId);
      if (preso) {
        setTicketAtual(preso);
        useToast("Atendimento recuperado!", 'info');
      }
    } catch (e) { useToast("Sem ticket Pendente.", 'warning'); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.get('/usuario');
      const usuarios: IUsuario[] = response.data;
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
  //ok   - patch
  const chamarProximo = async () => {
    if (!usuarioLogado) return;
    setLoading(true);
    try {
      const response = await TicketService.patch(
        OpcoesTicket.CHAMAR, OpcoesTicket.CHAMAR); // service
      setTicketAtual(response);
      setEditando(true);
    } catch (error: any) {
      exibirErro(error);
    } finally {
      setLoading(false);
    }
  };

  const salvarPaciente = async () => {
    if (!ticketAtual || !ticketAtual.ticketId) return;
    try {
      await api.patch(`/paciente/${ticketAtual.codigo}`, {
        nome, CPF: cpf, telefone, CEP: cep
      });
      useToast("Dados salvos!", 'success');
      // Atualiza visualmente
      setTicketAtual({ ...ticketAtual, paciente: { nome, CPF: cpf, telefone, CEP: cep } });
      setEditando(false);
    } catch (error) { exibirErro(error); }
  };

  const finalizar = async () => {
    if (!ticketAtual) return;
    try {
      await TicketService.patch(OpcoesTicket.FINALIZAR, ticketAtual.ticketId); // service
      setTicketAtual(null);
      useToast("Finalizado!", 'success');
    } catch (e) { exibirErro(e); }
  };

  const cancelar = async () => {
    if (!ticketAtual) return;
    if (!confirm("Confirmar ausência do paciente?")) return;
    try {
      await TicketService.patch(OpcoesTicket.CANCELAR, ticketAtual.ticketId); // service
      setTicketAtual(null);
      useToast("Cancelado.", 'info');
    } catch (e) { exibirErro(e); }
  };

  const excluirTicket = async () => {
    if (!ticketAtual) return;
    if (!confirm("EXCLUIR PERMANENTEMENTE?")) return;
    try {
      await TicketService.patch(OpcoesTicket.DELETAR, ticketAtual.ticketId); // service
      setTicketAtual(null);
      useToast("Excluído.", 'error');
    } catch (e) { exibirErro(e); }
  };

  if (!usuarioLogado) {
    return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2 className={styles.loginTitle}>Acesso Restrito</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className={styles.input}
            required
          />

          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            <LogIn size={20} /> Entrar
          </button>

          <Link to="/cadastro" className={styles.loginLink}>
            Não tem conta? Cadastre-se
          </Link>
        </form>
      </div>
    );
  }


  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Atendimento</h1>
        <div className={styles.userInfo}>
          <span>Olá, {usuarioLogado.usuarioNome}</span>
          <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`} style={{ padding: '5px 15px', fontSize: '0.9rem' }}>
            Sair
          </button>
        </div>
      </div>

      <div className={styles.card}>

        {ticketAtual ? (
          <>
            <div className={styles.cardHeader}>
              <span className={styles.labelSenha}>Senha Chamada</span>
              <button onClick={excluirTicket} className={styles.btnIcon} title="Excluir Ticket">
                <Trash2 size={20} color="#c0392b" />
              </button>
            </div>

            <h1 className={styles.ticketCode}>{ticketAtual.codigo}</h1>

            {/* Área do Formulário */}
            <div className={styles.formArea}>
              <div className={styles.formHeader}>
                <h3><User size={20} /> Dados do Paciente</h3>
                {!editando && (
                  <button onClick={() => setEditando(true)} className={styles.btnIcon} title="Editar">
                    <Edit2 size={18} color="#f39c12" />
                  </button>
                )}
              </div>

              {editando ? (
                <div className={styles.formGroup}>
                  <input placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} className={styles.input} />
                  <div className={styles.row}>
                    <input placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} className={styles.input} />
                    <input placeholder="Telefone" value={telefone} onChange={e => setTelefone(e.target.value)} className={styles.input} />
                  </div>
                  <input placeholder="CEP" value={cep} onChange={e => setCep(e.target.value)} className={styles.input} />

                  <div className={styles.btnGroup}>
                    <button onClick={salvarPaciente} className={`${styles.btn} ${styles.btnSuccess}`}>Salvar</button>
                    <button onClick={() => setEditando(false)} className={`${styles.btn} ${styles.btnSecondary}`}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p><strong>Nome:</strong> {ticketAtual.paciente?.nome}</p>
                  <p><strong>CPF:</strong> {ticketAtual.paciente?.CPF || '-'}</p>
                  <p><strong>Tel:</strong> {ticketAtual.paciente?.telefone || '-'}</p>
                </div>
              )}
            </div>

            <div className={styles.actionButtons}>
              <button onClick={finalizar} className={`${styles.btn} ${styles.btnSuccess}`} style={{ padding: '15px 30px' }}>
                <CheckCircle size={24} /> Finalizar
              </button>
              <button onClick={cancelar} className={`${styles.btn} ${styles.btnDanger}`} style={{ padding: '15px 30px' }}>
                <XCircle size={24} /> Ausente
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Nenhum paciente na mesa</h2>

            <button
              onClick={chamarProximo}
              disabled={loading}
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`}
            >
              <Megaphone size={28} />
              {loading ? "Buscando..." : "CHAMAR PRÓXIMO"}
            </button>

            <div className={styles.refreshArea}>
              <button onClick={recuperarAtendimentoPreso} className={styles.btnRefresh}>
                <RefreshCw size={16} /> Verificar pendências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}