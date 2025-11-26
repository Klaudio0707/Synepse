import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Prioridade } from './entities/ticket.entity';
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Post()
  async gerarSenha(
    @Body('prioridade') prioridade: Prioridade,
    @Body('nome') nome?: string,
    @Body('cpf') cpf?: string,
  ) {
    return this.ticketService.criarSenha(prioridade, nome, cpf);
  }
  @Get()
  listar() {
    return this.ticketService.listarTodos();
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id') id: string) {
    return this.ticketService.finalizar(id);
  }
  @Patch('chamar')
  async chamarProximo(@Body('usuarioId') usuarioId: string) {
    return this.ticketService.chamarProximoTicket(usuarioId);
  }
  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.ticketService.cancelar(id);
  }


  @Delete(':id')
  deletar(@Param('id') id: string) {
    return this.ticketService.deletar(id);
  }
}
