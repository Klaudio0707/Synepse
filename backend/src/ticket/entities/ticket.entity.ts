import { Column, Model, Table, DataType, ForeignKey, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';
import { UsuarioEntidade } from 'src/usuario/entities/usuario.entity';

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
export class TicketEntidade extends Model<TicketEntidade> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare ticketId?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare codigo: string; // YYMMDD-PPSQ

  @Column({ type: DataType.ENUM(...Object.values(Prioridade)), allowNull: false })
  declare prioridade: Prioridade;

  @Column({ type: DataType.ENUM(...Object.values(StatusTicket)), defaultValue: StatusTicket.PENDENTE })
  declare status?: StatusTicket;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare data_emissao?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare data_chamada?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare data_finalizacao?: Date;

  @ForeignKey(() => PacienteEntidade)
  @Column({ type: DataType.UUID, allowNull: false })
  declare pacienteId?: string;

  @BelongsTo(() => PacienteEntidade)
  declare paciente?: PacienteEntidade;

  @ForeignKey(() => UsuarioEntidade)
  @Column({ type: DataType.UUID, allowNull: true })
  declare usuarioId?: string;

  @BelongsTo(() => UsuarioEntidade)
  declare usuario?: UsuarioEntidade;
}