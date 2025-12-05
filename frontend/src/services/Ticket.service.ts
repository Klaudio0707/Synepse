import type {AxiosResponse } from "axios";
import { api } from "../config/api";
import { OpcoesTicket } from "../pages/Admin";
import type { ITicket } from "../types/ITicket";

export default class TicketService {
  static async get(): Promise<ITicket[]> {
    try {
      const response = await api.get('/ticket');
      return response.data as ITicket[];
    } catch (error) {
      console.error("Erro ao buscar tickets", error);
      throw error;
    }
  }
  static async patch(acao: OpcoesTicket, id?: string): Promise<ITicket> {
    try{
      let response: AxiosResponse<ITicket>;
    switch (acao) {
      case OpcoesTicket.CHAMAR:
        response = await api.patch<ITicket>('/ticket/chamar', { usuarioId: id });
        break;

      case OpcoesTicket.FINALIZAR:
        response = await api.patch<ITicket>(`/ticket/${id}/finalizar`);
        break;

      case OpcoesTicket.CANCELAR:
        response = await api.patch<ITicket>(`/ticket/${id}/cancelar`);
        break;

      case OpcoesTicket.DELETAR:
        response = await api.patch<ITicket>(`/ticket/${id}/`);
        break;

      default:
        throw new Error('Ação de ticket inválida');
    }

    return response.data as ITicket;
  } catch (error) {
    console.error("Erro ao processar ticket", error);
    throw error;
  }
}
}