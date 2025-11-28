import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

   @Patch(':id') 
  atualizar(@Param('id') id: string, @Body() dados: UpdatePacienteDto) {
    return this.pacienteService.update(id, dados);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.pacienteService.findOne(id);
  }
}