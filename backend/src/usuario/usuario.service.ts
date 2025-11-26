import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioEntidade } from './entities/usuario.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
  export class UsuarioService {
    constructor(
      @InjectModel(UsuarioEntidade)
      private usuarioModel: typeof UsuarioEntidade,
    ) {}
  
    async create(createUsuarioDto: CreateUsuarioDto) {

      return this.usuarioModel.create({
        ...createUsuarioDto,
        role: createUsuarioDto.role || 'ATENDENTE' 
      }as UsuarioEntidade);
    }
  
    async findAll() {
      return this.usuarioModel.findAll();
    }
  }
