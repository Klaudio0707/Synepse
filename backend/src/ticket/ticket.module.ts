import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketEntidade } from './entities/ticket.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([TicketEntidade, PacienteEntidade]),],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule { }
