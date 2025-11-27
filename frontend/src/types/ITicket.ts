  
export interface Ticket {
    ticketId: string;
    codigo: string;
    prioridade: 'SP' | 'SG' | 'SE';
    status: string;
    data_chamada: string;
    paciente?: {
      nome: string;
    }
    usuario?: { // Caso queira mostrar quem chamou
      nome: string;
    }
  }

