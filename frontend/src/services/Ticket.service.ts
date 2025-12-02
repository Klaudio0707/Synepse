
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
}

async function runExample() {
    console.log('Fetching all tickets...');
  
    try {
      const tickets = await TicketService.get();
      console.log('Todos os tickets:', tickets);
  
      const teste = await TicketService.get();
      console.log('Teste result:', teste);
    } catch (error) {
      // Se o toast estiver no service, aqui pode só logar
      console.error('Erro ao executar exemplo:', error);
    }
  }

// Call the async wrapper function to run your logic
runExample();


// static getOne(id: string): IContact | undefined {
//     const contacts = this.get()
//     return contacts.find((contact: IContact) => contact.id === id)
// }

// static post(contact: IContact) {
//     const contacts = this.get();
//     const isDuplicate = contacts.some(
//         (existingContact) =>
//             existingContact.email === contact.email ||
//             existingContact.phone === contact.phone
//     );
//     // Verifica se o contato possui e-mail ou telefone duplicados
//     if (isDuplicate) {
//         throw new Error(
//             "Já existe um contato com este e-mail ou telefone."
//         );
//     }