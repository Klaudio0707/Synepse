import { useEffect, useState } from 'react';
import { api } from '../../config/api';
import {  Clock, Users, FileText, Calendar, Trash2 } from 'lucide-react';
import useToast from '../../components/UseToaster';
import styles from './Dashboard.module.css'; // CSS Module
import type { ITicket } from '../../types/ITicket';

export function Dashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  // Estado para o filtro de data (inicia com a data de hoje: YYYY-MM-DD)
  const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]);
  
  const [stats, setStats] = useState({
    total: 0,
    tmGeral: 0,
    tmSP: 0,
    tmSE: 0,
    tmSG: 0
  });

  useEffect(() => {
    carregarDados();
    // Atualiza a cada 5 segundos
    const interval = setInterval(carregarDados, 5000);
    return () => clearInterval(interval);
  }, [filtroData]); // Recarrega se mudar a data

  const carregarDados = async () => {
    try {
      const response = await api.get('/ticket');
      const todos: ITicket[] = response.data;

      // --- FILTRO DE DATA ---
      // Compara a parte da data (YYYY-MM-DD) da emissão com o filtro escolhido
      const filtrados = todos.filter(t => 
        t.data_emissao!.startsWith(filtroData)
      );

      setTickets(filtrados);
      calcularMetricas(filtrados);
    } catch (error) { 
      console.error("Erro ao carregar dashboard", error); 
    }
  };

  const excluirTicket = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;
    
    try {
      await api.delete(`/ticket/${id}`);
      useToast("Registro excluído!", 'success');
      carregarDados(); // Atualiza a lista na hora
    } catch (error) {
      useToast("Erro ao excluir.", 'error');
    }
  };

  const calcularMetricas = (dados: ITicket[]) => {
    const atendidos = dados.filter(t => t.status === 'ATENDIDO' && t.data_chamada && t.data_finalizacao);
    
    const calcularTM = (lista: ITicket[]) => {
      if (lista.length === 0) return 0;
      const totalMinutos = lista.reduce((acc, t) => {
        const inicio = new Date(t.data_chamada!).getTime();
        const fim = new Date(t.data_finalizacao!).getTime();
        return acc + (fim - inicio);
      }, 0);
      return Math.round((totalMinutos / lista.length) / 60000); 
    };

    setStats({
      total: dados.length,
      tmGeral: calcularTM(atendidos),
      tmSP: calcularTM(atendidos.filter(t => t.prioridade === 'SP')),
      tmSE: calcularTM(atendidos.filter(t => t.prioridade === 'SE')),
      tmSG: calcularTM(atendidos.filter(t => t.prioridade === 'SG')),
    });
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Relatórios Gerenciais</h1>
      </div>
      {/* Cards de KPIs */}
      <div className={styles.kpiGrid}>
        <Card icone={<Users />} titulo="Total do Dia" valor={stats.total} cor="#34495e" />
        <Card icone={<Clock />} titulo="TM Geral" valor={`${stats.tmGeral} min`} cor="#27ae60" />
        <Card icone={<Clock />} titulo="TM Prioritário" valor={`${stats.tmSP} min`} cor="#e74c3c" />
        <Card icone={<Clock />} titulo="TM Exames" valor={`${stats.tmSE} min`} cor="#f1c40f" />
      </div>
   
      {/* Tabela Detalhada */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <FileText size={24} /> 
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Detalhamento de Atendimentos</h2>
          <div className={styles.filterArea}>
          <Calendar size={20} color="#7f8c8d" />
          <strong style={{ color: '#454a4bff' }}>Data:</strong>
          <input 
            type="date" 
            value={filtroData} 
            onChange={(e) => setFiltroData(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Senha</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Emissão</th>
              <th>Atendimento</th>
              <th>Atendente</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? tickets.map(t => (
              <tr key={t.ticketId}>
                <td><strong>{t.codigo}</strong></td>
                
                <td style={{ color: t.prioridade === 'SP' ? '#e74c3c' : '#2980b9', fontWeight: 'bold' }}>
                    {t.prioridade}
                </td>

                <td>
                  <span className={styles.statusBadge} style={{ 
                    background: t.status === 'ATENDIDO' ? '#d4edda' : t.status === 'CANCELADO' ? '#f8d7da' : t.status === 'CHAMADO' ? '#cce5ff' : '#fff3cd',
                    color: t.status === 'ATENDIDO' ? '#155724' : t.status === 'CANCELADO' ? '#721c24' : t.status === 'CHAMADO' ? '#004085' : '#856404'
                  }}>
                    {t.status}
                  </span>
                </td>

                <td>{new Date(t.data_emissao!).toLocaleTimeString()}</td>
                <td>{t.data_chamada ? new Date(t.data_chamada).toLocaleTimeString() : '-'}</td>
                
                <td>
                  {t.usuario ? (
                    <span style={{ color: '#2980b9', fontWeight: 'bold' }}>{t.usuario.usuarioNome}</span>
                  ) : '-'}
                </td>

                {/* Botão de Excluir */}
                <td>
                  <button onClick={() => excluirTicket(t.ticketId)} className={styles.btnDelete} title="Excluir Registro">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', fontStyle: 'italic' }}>
                  Nenhum registro encontrado para esta data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente Card auxiliar (adaptado para usar styles)
const Card = ({ icone, titulo, valor, cor }: any) => (
  <div className={styles.card} style={{ borderLeft: `5px solid ${cor}` }}>
    <div className={styles.cardContent}>
      <p>{titulo}</p>
      <h2>{valor}</h2>
    </div>
    <div className={styles.cardIcon} style={{ color: cor }}>{icone}</div>
  </div>
);