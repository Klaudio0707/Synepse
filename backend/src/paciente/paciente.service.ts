import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PacienteEntidade } from './entities/paciente.entity';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(
    @InjectModel(PacienteEntidade)
    private pacienteModel: typeof PacienteEntidade,
  ) {}

  async findAll() {
    return this.pacienteModel.findAll();
  }
 async update(id: string, dados: UpdatePacienteDto) {
    const paciente = await this.pacienteModel.findByPk(id);
    if (!paciente) throw new NotFoundException('Paciente não encontrado');
    
    return paciente.update(dados);
  }

  // Método auxiliar para buscar
  async findOne(id: string) {
    return this.pacienteModel.findByPk(id);
  }
}