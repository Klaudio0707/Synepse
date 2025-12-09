import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../config/api';
import { Megaphone, CheckCircle, XCircle, User, LogIn, RefreshCw, Edit2, Save, Trash2, Ticket } from 'lucide-react';
import useToast from '../../components/UseToaster';
import styles from './Admin.module.css';
import type { ITicket } from '../../types/ITicket';
import type { IUsuario } from '../../types/IUsuario';
import TicketService from '../../services/Ticket.service';
import FormLogin from '../../components/FormLogin';
import BtnUsuario from '../../components/BtnUsuario';
import FormPaciente from '../../components/FormPaciente';



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
      const ticket = await TicketService.getAll(); // service 
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
      const response = await TicketService.chamar(usuarioLogado.usuarioId); // service
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
  //ok - patch Finalizar
  const finalizar = async () => {
    if (!ticketAtual) return;
    try {
      await TicketService.finalizar(ticketAtual.ticketId); // service
      setTicketAtual(null);
      useToast("Finalizado!", 'success');
    } catch (e) { exibirErro(e); }
  };
  //ok - patch cancelar
  const cancelar = async () => {
    if (!ticketAtual) return;
    if (!confirm("Confirmar ausência do paciente?")) return;
    try {
      await TicketService.cancelar(ticketAtual.ticketId)// service
      setTicketAtual(null);
      useToast("Cancelado.", 'info');
    } catch (e) { exibirErro(e); }
  };

  const excluirTicket = async () => {
    if (!ticketAtual) return;
    if (!confirm("EXCLUIR PERMANENTEMENTE?")) return;
    try {
      await TicketService.deletar(ticketAtual.ticketId); // service
      setTicketAtual(null);
      useToast("Excluído.", 'error');
    } catch (e) { exibirErro(e); }
  };

  if (!usuarioLogado) {
    return (
      <>
        <FormLogin
          email={email}
          senha={senha}
          onEmailChange={setEmail}
          onSenhaChange={setSenha}
          onSubmit={handleLogin}
        />
      </>
    );
  }
  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Atendimento</h1>
        <BtnUsuario usuarioNome=
          {usuarioLogado.usuarioNome}
          onLogout={handleLogout}
        />
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
            <FormPaciente
              nome={nome}
              cpf={cpf}
              telefone={telefone}
              cep={cep}
              editando={editando}
              onChangeNome={setNome}
              onChangeCpf={setCpf}
              onChangeTelefone={setTelefone}
              onChangeCep={setCep}
              onSalvar={salvarPaciente}
              onEditar={() => setEditando(true)}
              onCancelar={() => setEditando(false)}
            />

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