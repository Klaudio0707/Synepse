import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsuarioEntidade } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

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

  async delete(id: string) {
    const usuario = await this.usuarioModel.findByPk(id);
    if(usuario) await usuario.destroy();
    return { message: 'Usuário removido' };
  }
}