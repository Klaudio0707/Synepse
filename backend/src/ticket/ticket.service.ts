import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Prioridade, StatusTicket, TicketEntidade } from './entities/ticket.entity';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketEntidade)
    private ticket: typeof TicketEntidade,
    @InjectModel(PacienteEntidade)
    private paciente: typeof PacienteEntidade,
  ) { }

  async criarSenha(tipo: Prioridade, nomePaciente?: string, pacienteCPF?: string) {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear().toString().slice(-2);
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const prefixoData = `${ano}${mes}${dia}`;

    const inicioDoDia = new Date();
    inicioDoDia.setHours(0, 0, 0, 0);

    const count = await this.ticket.count({
      where: {
        prioridade: tipo,
        data_emissao: {
          [Op.gte]: inicioDoDia,
        },
      },
    });
    const sequencia = (count + 1).toString().padStart(2, '0');
    const codigoGerado = `${prefixoData}-${tipo}${sequencia}`;
    const nomeFinal = nomePaciente ? nomePaciente : codigoGerado;
    const novoPaciente = await this.paciente.create({
      nome: nomeFinal,
      CPF: pacienteCPF || null,
    } as PacienteEntidade);

    const novoTicket = await this.ticket.create({
      codigo: codigoGerado,
      prioridade: tipo,
      status: StatusTicket.PENDENTE,
      data_emissao: new Date(),
      pacienteId: novoPaciente.pacienteId,
    } as TicketEntidade);

    return novoTicket;
  }
}
