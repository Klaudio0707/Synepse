import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PacienteEntidade } from './entities/paciente.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([PacienteEntidade]),],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule { }
