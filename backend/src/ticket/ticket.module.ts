import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketEntidade } from './entities/ticket.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';
import { UsuarioEntidade } from 'src/usuario/entities/usuario.entity';

@Module({
 imports: [

    SequelizeModule.forFeature([TicketEntidade, PacienteEntidade, UsuarioEntidade]), 
  ],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule { }
