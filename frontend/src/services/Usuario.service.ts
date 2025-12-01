// export default class ContactsService {

//     static get(): IContact[] {
//         const contacts = localStorage.getItem(this.storage)
//         return contacts ? JSON.parse(contacts) : []
//     }

//     static getOne(id: string): IContact | undefined {
//         const contacts = this.get()
//         return contacts.find((contact: IContact) => contact.id === id)
//     }

//     static post(contact: IContact) {
//         const contacts = this.get();
//         const isDuplicate = contacts.some(
//             (existingContact) =>
//                 existingContact.email === contact.email ||
//                 existingContact.phone === contact.phone
//         );
//         // Verifica se o contato possui e-mail ou telefone duplicados
//         if (isDuplicate) {
//             throw new Error(
//                 "Já existe um contato com este e-mail ou telefone."
//             );
//         }
//         contacts.push(contact);
//         localStorage.setItem(this.storage, JSON.stringify(contacts));
//     }

//     static delete(id: string) {
//         const contacts = this.get()
//         const filteredContacts = contacts.filter((contact: IContact) => contact.id !== id)
//         localStorage.setItem(this.storage, JSON.stringify(filteredContacts))
//     }

//     static async update(id: string, updatedContact: IContact) {
//         try {
//             const contacts = this.get();
//             const contactIndex = contacts.findIndex((contact: IContact) => contact.id === id);

//             if (contactIndex === -1) {
//                 throw new Error(`Contato com id ${id} não encontrado.`);
//             }

//             // Atualiza o contato no índice encontrado
//             contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };

//             // Armazena a lista atualizada no localStorage
//             localStorage.setItem(this.storage, JSON.stringify(contacts));
//         } catch (error) {
//             console.error("Erro ao atualizar o contato:", error);
//         }
//     }
// }