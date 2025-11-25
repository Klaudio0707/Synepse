
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { TicketEntidade } from "src/ticket/entities/ticket.entity";

@Table({ tableName: 'pacientes' })
export class PacienteEntidade extends Model<PacienteEntidade> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare pacienteId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nome: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare CPF?: string | null;

  @HasMany(() => TicketEntidade)
  declare tickets?: TicketEntidade[];
}
