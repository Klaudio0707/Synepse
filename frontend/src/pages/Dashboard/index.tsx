import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PieChart, Clock, Users, FileText, Download } from 'lucide-react';

interface Ticket {
  id: string; // ou ticketId, dependendo do seu banco atual
  codigo: string;
  prioridade: string;
  status: string;
  data_emissao: string;
  data_chamada?: string;
  data_finalizacao?: string;
 usuario?: { 
    usuarioNome: string; 
  }; 
}

export function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    tmGeral: 0, // Tempo Médio Geral (minutos)
    tmSP: 0,
    tmSE: 0,
    tmSG: 0
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await api.get('/ticket');
      const dados: Ticket[] = response.data;
      setTickets(dados);
      calcularMetricas(dados);
      console.log(dados);
    } catch (error) { console.error("Erro ao carregar dashboard"); }
  };

  const calcularMetricas = (dados: Ticket[]) => {
    // Filtra apenas os finalizados para cálculo de tempo
    const atendidos = dados.filter(t => t.status === 'ATENDIDO' && t.data_chamada && t.data_finalizacao);
    
    const calcularTM = (lista: Ticket[]) => {
      if (lista.length === 0) return 0;
      const totalMinutos = lista.reduce((acc, t) => {
        const inicio = new Date(t.data_chamada!).getTime();
        const fim = new Date(t.data_finalizacao!).getTime();
        return acc + (fim - inicio);
      }, 0);
      return Math.round((totalMinutos / lista.length) / 60000); // Ms -> Minutos
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
    <div style={{ padding: '40px', background: '#ecf0f1', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Relatórios Gerenciais</h1>

      {/* Cards de Tempo Médio (TM) */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Card icone={<Users />} titulo="Total de Senhas" valor={stats.total} cor="#34495e" />
        <Card icone={<Clock />} titulo="TM Geral" valor={`${stats.tmGeral} min`} cor="#27ae60" />
        <Card icone={<Clock />} titulo="TM Prioritário" valor={`${stats.tmSP} min`} cor="#e74c3c" />
        <Card icone={<Clock />} titulo="TM Exames" valor={`${stats.tmSE} min`} cor="#f1c40f" />
      </div>

      {/* Tabela Detalhada (Exigência do PDF) */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7f8c8d', marginBottom: '20px' }}>
          <FileText /> Relatório Detalhado de Atendimentos
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', color: '#2c3e50' }}>
                <th style={thStyle}>Senha</th>
                <th style={thStyle}>Tipo</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Emissão</th>
                <th style={thStyle}>Chamada</th>
                <th style={thStyle}>Atendente</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #221c1cff', color: '#030303ff'}}>
                  <td style={tdStyle}><strong>{t.codigo}</strong></td>
                  <td style={tdStyle}>{t.prioridade}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                      padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem',
                      background: t.status === 'ATENDIDO' ? '#24eb52ff' : t.status === 'CANCELADO' ? '#d3717aff' : '#fff3cd',
                      color: t.status === 'ATENDIDO' ? '#155724' : t.status === 'CANCELADO' ? '#721c24' : '#856404'
                    }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(t.data_emissao).toLocaleTimeString()}</td>
                  <td style={tdStyle}>{t.data_chamada ? new Date(t.data_chamada).toLocaleTimeString() : '-'}</td>
                  <td style={tdStyle}>{t.usuario?.usuarioNome || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '15px', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '15px' };

const Card = ({ icone, titulo, valor, cor }: any) => (
  <div style={{ flex: 1, minWidth: '200px', background: 'white', padding: '25px', borderRadius: '15px', borderLeft: `5px solid ${cor}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <p style={{ margin: 0, color: '#95a5a6', fontSize: '0.9rem' }}>{titulo}</p>
      <h2 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', color: '#2c3e50' }}>{valor}</h2>
    </div>
    <div style={{ color: cor, transform: 'scale(1.5)', opacity: 0.8 }}>{icone}</div>
  </div>
);