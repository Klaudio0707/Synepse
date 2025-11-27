import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { PieChart, BarChart, Users, XCircle, CheckCircle } from 'lucide-react';

interface Ticket {
  ticketId: string;
  codigo: string;
  prioridade: string;
  status: 'PENDENTE' | 'CHAMADO' | 'ATENDIDO' | 'CANCELADO';
}

export function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    atendidos: 0,
    cancelados: 0,
    porPrioridade: { SP: 0, SE: 0, SG: 0 }
  });

  useEffect(() => {
    carregarDados();
    // Atualiza a cada 5 segundos para parecer "Tempo Real"
    const interval = setInterval(carregarDados, 5000); 
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      const response = await api.get('/ticket');
      const tickets: Ticket[] = response.data;

      // Cálculos Matemáticos
      const pendentes = tickets.filter(t => t.status === 'PENDENTE').length;
      const atendidos = tickets.filter(t => t.status === 'ATENDIDO').length;
      const cancelados = tickets.filter(t => t.status === 'CANCELADO').length; // Inclui descartados
      
      const sp = tickets.filter(t => t.prioridade === 'SP').length;
      const se = tickets.filter(t => t.prioridade === 'SE').length;
      const sg = tickets.filter(t => t.prioridade === 'SG').length;

      setStats({
        total: tickets.length,
        pendentes,
        atendidos,
        cancelados,
        porPrioridade: { SP: sp, SE: se, SG: sg }
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard");
    }
  };

  return (
    <div style={{ padding: '40px', background: '#ecf0f1', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Dashboard Gerencial</h1>

      {/* Cards Superiores */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Card icone={<Users />} titulo="Total Emitido" valor={stats.total} cor="#34495e" />
        <Card icone={<PieChart />} titulo="Na Fila (Pendentes)" valor={stats.pendentes} cor="#f39c12" />
        <Card icone={<CheckCircle />} titulo="Atendidos" valor={stats.atendidos} cor="#27ae60" />
        <Card icone={<XCircle />} titulo="Cancelados" valor={stats.cancelados} cor="#c0392b" />
      </div>

      {/* Gráficos (Barras Simples com CSS) */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7f8c8d' }}>
          <BarChart /> Distribuição por Prioridade
        </h2>
        
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Barra label="Prioritário (SP)" valor={stats.porPrioridade.SP} total={stats.total} cor="#e74c3c" />
          <Barra label="Exames (SE)" valor={stats.porPrioridade.SE} total={stats.total} cor="#f1c40f" />
          <Barra label="Geral (SG)" valor={stats.porPrioridade.SG} total={stats.total} cor="#3498db" />
        </div>
      </div>
    </div>
  );
}

// Componentes Auxiliares
const Card = ({ icone, titulo, valor, cor }: any) => (
  <div style={{ 
    flex: 1, minWidth: '200px', background: 'white', padding: '25px', 
    borderRadius: '15px', borderLeft: `5px solid ${cor}`,
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  }}>
    <div>
      <p style={{ margin: 0, color: '#95a5a6', fontSize: '0.9rem' }}>{titulo}</p>
      <h2 style={{ margin: '5px 0 0 0', fontSize: '2.5rem', color: '#2c3e50' }}>{valor}</h2>
    </div>
    <div style={{ color: cor, transform: 'scale(1.5)', opacity: 0.8 }}>{icone}</div>
  </div>
);

const Barra = ({ label, valor, total, cor }: any) => {
  const porcentagem = total > 0 ? (valor / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <strong>{label}</strong>
        <span>{valor} ({porcentagem.toFixed(1)}%)</span>
      </div>
      <div style={{ width: '100%', height: '15px', background: '#ecf0f1', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${porcentagem}%`, height: '100%', background: cor, transition: 'width 1s ease-in-out' }} />
      </div>
    </div>
  );
};