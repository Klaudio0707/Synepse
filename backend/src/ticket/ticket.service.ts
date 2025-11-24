import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Prioridade, TicketEntidade } from './entities/ticket.entity';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketEntidade)
    private ticket: typeof TicketEntidade,
     @InjectModel(PacienteEntidade)
     private paciente: typeof PacienteEntidade,
  ){}

  async criarSenha(tipo: Prioridade, nomePaciente?: string, pacienteCPF?:string){
    
    
  }
}
