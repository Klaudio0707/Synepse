import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  listar() {
    return this.pacienteService.findAll();
  }

@Patch(':id')
  atualizar(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) { // Use o DTO
    return this.pacienteService.update(id, updatePacienteDto);
  }
}