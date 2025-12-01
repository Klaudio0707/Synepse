  
export interface ITicket{
  ticketId: string;
  codigo: string;
  prioridade: string;
  status: string;
  data_emissao?: string;
  data_chamada?: string;
  data_finalizacao?: string;
  CPF:string,
  telefone:string,
  CEP:string,
  paciente?: {
      nome: string;
      telefone:string;
      CPF:string;
      CEP:string;
    };
  usuario?: { 
    usuarioNome: string; 
  }; 
}