import { Column, Model, Table, DataType, HasMany, PrimaryKey } from 'sequelize-typescript';
import { TicketEntidade } from 'src/ticket/entities/ticket.entity';

@Table({ tableName: 'usuarios' })
export class UsuarioEntidade extends Model<UsuarioEntidade> {
  @PrimaryKey
  @Column({
    type: DataType.UUID, 
    defaultValue: DataType.UUIDV4,
  })
  declare id?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare usuarioNome: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare usuarioEmail: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare usuarioSenha: string; // Em produção, isso sera hash

  @Column({
    type: DataType.ENUM('ADMIN', 'ATENDENTE'),
    defaultValue: 'ATENDENTE'
  })
  declare role?: string;

  // Um atendente atende vários tickets
  @HasMany(() => TicketEntidade)
  declare ticketsAtendidos?: TicketEntidade[];
}