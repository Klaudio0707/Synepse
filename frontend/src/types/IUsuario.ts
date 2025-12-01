export interface IUsuario {
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  usuarioSenha?:string;
  role: string;
}