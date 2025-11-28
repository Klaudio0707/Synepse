import { Injectable, NotFoundException } from '@nestjs/common';
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
  async chamarProximoTicket(usuarioId:string){
    const ultimaChamada = await this.ticket.findOne({
      where: {status: {[Op.or]: [StatusTicket.CHAMADO, StatusTicket.ATENDIDO]}}
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
      if (temSP) {
        proximaPrioridade = Prioridade.SP;
      } else {
        const temSE = await this.verificarFila(Prioridade.SE);
        if (temSE) proximaPrioridade = Prioridade.SE;
        else proximaPrioridade = Prioridade.SG; // Sobra a Geral
      }
    }

    const proximoTicket = await this.ticket.findOne({
      where: {
        status: StatusTicket.PENDENTE,
        prioridade: proximaPrioridade
      },
      order: [['data_emissao', 'ASC']],
      include: [this.paciente]
    });

    if (!proximoTicket) {
      throw new NotFoundException('Não há senhas na fila para atendimento.');
    }

    return proximoTicket.update({
      status: StatusTicket.CHAMADO,
      id: usuarioId,
      data_chamada: new Date(),
    });
    
  }

 
 async finalizar(ticketId: string) {
    const ticket = await this.ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket não encontrado');

    return ticket.update({
      status: StatusTicket.ATENDIDO,
      data_finalizacao: new Date()
    });
  }

  // 4. CANCELAR: Paciente desistiu
  async cancelar(ticketId: string) {
    const ticket = await this.ticket.findByPk(ticketId);
    if (!ticket) throw new Error('Ticket não encontrado');

    return ticket.update({
      status: StatusTicket.CANCELADO,
      data_finalizacao: new Date()
    });
  }

  // 5. LISTAR TODOS (Para o Painel e Relatórios)
  async listarTodos() {
    return this.ticket.findAll({
      order: [['data_emissao', 'DESC']], 
      include: [this.paciente] 
    });
  }

  // 6. DELETAR (Para admin limpar erros)
  async deletar(id: string) {
    const ticket = await this.ticket.findByPk(id);
    if (ticket) await ticket.destroy();
    return { message: 'Ticket removido' };
  }


  private async verificarFila(prio: Prioridade): Promise<boolean> {
    const count = await this.ticket.count({
      where: { status: StatusTicket.PENDENTE, prioridade: prio },
    });
    return count > 0;
  }
}
  

