import { Column, Model, Table, DataType, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';
import { UsuarioEntidade } from 'src/usuario/entities/usuario.entity';

// Enums exigidos pelo PDF
export enum Prioridade {
  SP = 'SP', // Prioritária
  SG = 'SG', // Geral
  SE = 'SE', // Exames
}

export enum StatusTicket {
  PENDENTE = 'PENDENTE',
  CHAMADO = 'CHAMADO',
  ATENDIDO = 'ATENDIDO',
  CANCELADO = 'CANCELADO', 
}

@Table({ tableName: 'tickets' })
export class TicketEntidade extends Model {
     @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare ticketId: string;
  
  @Column({ type: DataType.STRING, allowNull: false })
  codigo: string; // YYMMDD-PPSQ

  @Column({ type: DataType.ENUM(...Object.values(Prioridade)), allowNull: false })
  prioridade: Prioridade;

  @Column({ type: DataType.ENUM(...Object.values(StatusTicket)), defaultValue: StatusTicket.PENDENTE })
  status: StatusTicket;

 
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  data_emissao: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  data_chamada: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  data_finalizacao: Date;

  // --- RELACIONAMENTOS (Foreign Keys) ---

  @ForeignKey(() => PacienteEntidade)
  @Column({ type: DataType.UUID, allowNull: false })
  pacienteId: string;

  @BelongsTo(() => PacienteEntidade)
  paciente: PacienteEntidade;

  @ForeignKey(() => UsuarioEntidade)
  @Column({ type: DataType.INTEGER, allowNull: true }) // Nullable: nasce sem atendente
  usuarioId: number;

  @BelongsTo(() => UsuarioEntidade)
 usuario: UsuarioEntidade;
}