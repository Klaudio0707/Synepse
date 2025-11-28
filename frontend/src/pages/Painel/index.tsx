import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Monitor } from 'lucide-react';
import type { Ticket } from '../../types/ITicket';
import useToast from '../../components/UseToaster';
import styles from './Painel.module.css';

export function Painel() {
  const [chamadas, setChamadas] = useState<Ticket[]>([]);
  const [senhaPrincipal, setSenhaPrincipal] = useState<Ticket | null>(null);

  // Função que busca os dados
  const atualizarPainel = async () => {
    try {
      const response = await api.get('/ticket'); 
      const todos: Ticket[] = response.data;

      // Filtra só quem foi CHAMADO
     const chamados = todos.filter(t => 
        (t.status === 'CHAMADO' || t.status === 'ATENDIDO') && t.data_chamada
      );

      // Ordena: Mais recente primeiro (quem foi chamado agora fica no topo)
      chamados.sort((a, b) => new Date(b.data_chamada).getTime() - new Date(a.data_chamada).getTime());

      // A senha principal é a primeira da lista (a mais recente)
      if (chamados.length > 0) {
        setSenhaPrincipal(chamados[0]);
        
        // As próximas 4 senhas vão para o histórico lateral
        setChamadas(chamados.slice(1, 5));  // A primeira da lista é a principal
      }
    } catch (error) {
      useToast('Erro ao buscar senhas.\n'+error, 'error');
      // console.error("Erro ao buscar senhas", error);
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
   <div className={styles.container}>
      
      {/* --- Lado Esquerdo: A Senha da Vez (Gigante) --- */}
      <div className={styles.mainArea}>
        {senhaPrincipal ? (
          <>
            <h2 className={styles.mainTitle}>SENHA ATUAL</h2>
            
            <h1 
              className={styles.senhaGigante} 
              style={{ color: getCor(senhaPrincipal.prioridade) }}
            >
              {senhaPrincipal.codigo}
            </h1>
            
            <div 
              className={styles.subInfo}
              style={{ color: getCor(senhaPrincipal.prioridade) }}
            >
              {senhaPrincipal.prioridade === 'SP' ? 'PRIORITÁRIO' : 
               senhaPrincipal.prioridade === 'SE' ? 'EXAME' : 'GERAL'}
            </div>

            <div className={styles.guicheBadge}>
               <span className={styles.guicheTitle}>GUICHÊ 01</span>
               <span className={styles.guicheSub}>DIRIJA-SE AO LOCAL</span>
            </div>
          </>
        ) : (
          <h1 className={styles.aguardando}>Aguardando chamadas...</h1>
        )}
      </div>

      {/* --- Lado Direito: Histórico (Últimas 4) --- */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarHeader}>
          <Monitor size={32} /> Últimas Chamadas
        </h2>
        
        <div className={styles.historyList}>
          {chamadas.length > 0 ? chamadas.map(ticket => (
            <div 
              key={ticket.ticketId}
              className={styles.historyItem}
              style={{ borderLeft: `8px solid ${getCor(ticket.prioridade)}` }}
            >
              <span className={styles.historyCode} style={{ color: 'white' }}>
                {ticket.codigo}
              </span>
              
              <div>
                 <span className={styles.historyTime}>
                    {new Date(ticket.data_chamada).toLocaleTimeString().slice(0,5)}
                 </span>
                 <span 
                   className={styles.historyStatus}
                   style={{ color: ticket.status === 'ATENDIDO' ? '#2ecc71' : '#f1c40f' }}
                 >
                    {ticket.status}
                 </span>
              </div>
            </div>
          )) : (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic', textAlign: 'center' }}>Histórico vazio.</p>
          )}
        </div>
      </div>
    </div>
  );
}