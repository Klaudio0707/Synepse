import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { TicketEntidade } from 'src/ticket/entities/ticket.entity';

@Table({ tableName: 'users' })
export class UsuarioEntidade extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare usuarioNome: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare usuarioEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare usuarioSenha: string; // Em produção, isso seria hash

  @Column({ 
    type: DataType.ENUM('ADMIN', 'ATENDENTE'), 
    defaultValue: 'ATENDENTE' 
  })
  declare permissaoUsuario: string;

  // Um atendente atende vários tickets
  @HasMany(() => TicketEntidade)
  declare ticketsAtendidos: TicketEntidade[];
}