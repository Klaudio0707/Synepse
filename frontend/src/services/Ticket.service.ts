import { api } from "../config/api";
import type { ITicket } from "../types/ITicket";

export default class TicketService {
  static async getAll(): Promise<ITicket[]> {
    const response = await api.get<ITicket[]>('/ticket');
    return response.data;
  }

  static async chamar(usuarioId: string): Promise<ITicket> {
    const response = await api.patch<ITicket>('/ticket/chamar', { usuarioId });
    return response.data;
  }

  static async finalizar(id: string): Promise<ITicket> {
    const response = await api.patch<ITicket>(`/ticket/${id}/finalizar`);
    return response.data;
  }

  static async cancelar(id: string): Promise<ITicket> {
    const response = await api.patch<ITicket>(`/ticket/${id}/cancelar`);
    return response.data;
  }

  static async deletar(id: string): Promise<void> {
    await api.delete(`/ticket/${id}`);
  }
}