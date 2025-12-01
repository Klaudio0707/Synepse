import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Prioridade, StatusTicket, TicketEntidade } from './entities/ticket.entity';
import { PacienteEntidade } from 'src/paciente/entities/paciente.entity';
import { UsuarioEntidade } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(TicketEntidade) private ticketModel: typeof TicketEntidade,
    @InjectModel(PacienteEntidade) private pacienteModel: typeof PacienteEntidade,
    @InjectModel(UsuarioEntidade) private usuarioModel: typeof UsuarioEntidade,
  ) { }

  async criarSenha(tipo: Prioridade, nomePaciente?: string, pacienteCPF?: string) {
    const dataAtual = new Date();
    const prefixoData = `${dataAtual.getFullYear().toString().slice(-2)}${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}${dataAtual.getDate().toString().padStart(2, '0')}`;
    const inicioDoDia = new Date(); inicioDoDia.setHours(0, 0, 0, 0);

    const count = await this.ticketModel.count({
      where: { prioridade: tipo, data_emissao: { [Op.gte]: inicioDoDia } },
    });

    const codigoGerado = `${prefixoData}-${tipo}${(count + 1).toString().padStart(2, '0')}`;
    const nomeFinal = nomePaciente ? nomePaciente : codigoGerado;

    const novoPaciente = await this.pacienteModel.create({
      nome: nomeFinal,
      CPF: pacienteCPF || null,
    }as PacienteEntidade);

    return this.ticketModel.create({
      codigo: codigoGerado,
      prioridade: tipo,
      status: StatusTicket.PENDENTE,
      data_emissao: new Date(),
      pacienteId: novoPaciente.pacienteId,
    }as TicketEntidade);
  }

  async chamarProximo(usuarioId: string) {
    // 1. Verifica quem foi o último para alternar prioridade
    const ultimaChamada = await this.ticketModel.findOne({
      where: { status: { [Op.or]: [StatusTicket.CHAMADO, StatusTicket.ATENDIDO] } },
      order: [['data_chamada', 'DESC']]
    });

    let proximaPrioridade: Prioridade | null = null;

    if (ultimaChamada?.prioridade === Prioridade.SP) {
      const temSE = await this.verificarFila(Prioridade.SE);
      if (temSE) proximaPrioridade = Prioridade.SE;
      else {
        const temSG = await this.verificarFila(Prioridade.SG);
        if (temSG) proximaPrioridade = Prioridade.SG;
      }
    }
    
    if (!proximaPrioridade) {
      const temSP = await this.verificarFila(Prioridade.SP);
      if (temSP) proximaPrioridade = Prioridade.SP;
      else {
        const temSE = await this.verificarFila(Prioridade.SE);
        if (temSE) proximaPrioridade = Prioridade.SE;
        else proximaPrioridade = Prioridade.SG;
      }
    }

    const proximoTicket = await this.ticketModel.findOne({
      where: { status: StatusTicket.PENDENTE, prioridade: proximaPrioridade },
      order: [['data_emissao', 'ASC']],
      include: [this.pacienteModel]
    });

    if (!proximoTicket) throw new NotFoundException('Não há senhas na fila.');

    // CORREÇÃO: Atualiza o usuarioId (quem atendeu), não o ID do ticket
    return proximoTicket.update({
      status: StatusTicket.CHAMADO,
      usuarioId: usuarioId, 
      data_chamada: new Date(),
    });
  }

  async finalizar(id: string) {
    const ticket = await this.ticketModel.findByPk(id);
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    return ticket.update({ status: StatusTicket.ATENDIDO, data_finalizacao: new Date() });
  }

  async cancelar(id: string) {
    const ticket = await this.ticketModel.findByPk(id);
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    return ticket.update({ status: StatusTicket.CANCELADO, data_finalizacao: new Date() });
  }

  async deletar(id: string) {
    const ticket = await this.ticketModel.findByPk(id);
    if (!ticket) throw new NotFoundException('Ticket não encontrado');
    await ticket.destroy();
    return { message: 'Ticket removido' };
  }

  async listarTodos() {
    return this.ticketModel.findAll({
      order: [['data_emissao', 'DESC']],
      include: [
        this.pacienteModel,
      
        {
          model: this.usuarioModel,
          attributes: ['usuarioNome', 'usuarioEmail']
        }
      ],
    });
  }

  private async verificarFila(prio: Prioridade): Promise<boolean> {
    const count = await this.ticketModel.count({
      where: { status: StatusTicket.PENDENTE, prioridade: prio },
    });
    return count > 0;
  }
}