import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Monitor } from 'lucide-react';
import type { Ticket } from '../../types/ITicket';


export function Painel() {
  const [chamadas, setChamadas] = useState<Ticket[]>([]);
  const [senhaPrincipal, setSenhaPrincipal] = useState<Ticket | null>(null);

  // Função que busca os dados
  const atualizarPainel = async () => {
    try {
      const response = await api.get('/ticket'); // Traz todos
      const todos: Ticket[] = response.data;

      // Filtra só quem foi CHAMADO
      const chamados = todos.filter(t => t.status === 'CHAMADO');

      // Ordena pela data da chamada (Mais recente primeiro)
      chamados.sort((a, b) => new Date(b.data_chamada).getTime() - new Date(a.data_chamada).getTime());

      // Pega os 5 últimos
      const ultimos5 = chamados.slice(0, 5);

      setChamadas(ultimos5);
      if (ultimos5.length > 0) {
        setSenhaPrincipal(ultimos5[0]); // A primeira da lista é a principal
      }
    } catch (error) {
      console.error("Erro ao buscar senhas", error);
    }
  };

  // Efeito de "Polling" (Atualiza a cada 3 segundos)
  useEffect(() => {
    atualizarPainel(); // Busca a primeira vez
    const intervalo = setInterval(atualizarPainel, 3000); // Repete a cada 3s
    return () => clearInterval(intervalo); // Limpa ao sair da tela
  }, []);

  // Cores baseadas na prioridade
  const getCor = (prio: string) => {
    switch(prio) {
      case 'SP': return '#e74c3c'; // Vermelho
      case 'SE': return '#f1c40f'; // Amarelo
      case 'SG': return '#3498db'; // Azul
      default: return '#333';
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#2c3e50', color: 'white' }}>
      
      {/* Lado Esquerdo: A Senha da Vez (Gigante) */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid #555' }}>
        {senhaPrincipal ? (
          <>
            <h2 style={{ fontSize: '3rem', margin: 0 }}>SENHA ATUAL</h2>
            <h1 style={{ 
              fontSize: '10rem', 
              margin: '20px 0', 
              color: getCor(senhaPrincipal.prioridade),
              textShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
              {senhaPrincipal.codigo}
            </h1>
            <h3 style={{ fontSize: '2rem' }}>
              {senhaPrincipal.prioridade === 'SP' ? 'PRIORITÁRIO' : 
               senhaPrincipal.prioridade === 'SE' ? 'EXAME' : 'GERAL'}
            </h3>
            <p style={{ marginTop: '20px', color: '#bdc3c7' }}>Dirija-se ao guichê</p>
          </>
        ) : (
          <h1 style={{ color: '#7f8c8d' }}>Aguardando chamadas...</h1>
        )}
      </div>

      {/* Lado Direito: Histórico (Últimas 4) */}
      <div style={{ flex: 1, padding: '20px', background: '#34495e' }}>
        <h2 style={{ borderBottom: '1px solid #7f8c8d', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Monitor /> Últimas Chamadas
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {chamadas.slice(1).map(ticket => ( // Pula o primeiro (slice 1) pois já está na tela principal
            <div key={ticket.ticketId} style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '15px', 
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderLeft: `5px solid ${getCor(ticket.prioridade)}`
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{ticket.codigo}</span>
              <span style={{ fontSize: '1rem', color: '#bdc3c7' }}>
                 {new Date(ticket.data_chamada).toLocaleTimeString().slice(0,5)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}