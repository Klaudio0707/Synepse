import { api } from "../config/api";
import type { ITicket } from "../types/ITicket";

export default class TicketService{
    static async get(): Promise<ITicket[]> {
        try{
        const response = await api.get('/ticket');
        return response.data as ITicket[];
        }catch(error){
            console.error("Erro ao buscar tickets", error);
            throw error; 
    }
}
  static async patch(id:string): Promise<ITicket>{
  try{
    const response = await api.patch('/ticket/chamar',{
        usuarioId: id
    })
    return response.data as ITicket;
    }catch(error){
        console.error("Erro ao atualizar tickets", error);
        throw error;
    }
}
}