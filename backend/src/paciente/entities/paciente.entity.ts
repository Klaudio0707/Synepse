import { Model } from "sequelize";
import { Column, DataType, HasMany, PrimaryKey, Table } from "sequelize-typescript";
import { TicketEntidade } from "src/ticket/entities/ticket.entity";

@Table({tableName: 'pacientes'})
export class PacienteEntidade extends Model {
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
    declare pacienteNome:string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
   declare pacienteCPF: string;

    @HasMany(() => TicketEntidade)
    declare pacienteTickets: TicketEntidade[];
}
