import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PacienteEntidade } from './entities/paciente.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectModel(PacienteEntidade)
    private pacienteModel: typeof PacienteEntidade,
  ) {}

  async findAll() {
    return this.pacienteModel.findAll();
  }

  async findOne(id: string) {
    return this.pacienteModel.findByPk(id);
  }

  // Permite atualizar Nome e CPF
  async update(id: string, dados: { nome?: string; CPF?: string }) {
    const paciente = await this.pacienteModel.findByPk(id);
    if (!paciente) throw new Error('Paciente não encontrado');
    
    return paciente.update(dados);
  }
}