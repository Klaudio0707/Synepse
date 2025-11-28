import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsuarioEntidade } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto'; // Não esqueça de importar isso

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
    } as UsuarioEntidade);
  }

  async findAll() {
    return this.usuarioModel.findAll();
  }


  async findOne(id: string) {
    return this.usuarioModel.findByPk(id);
  }

  async update(id: string, dados: any) {
    const usuario = await this.usuarioModel.findByPk(id);
    if (!usuario) throw new Error('Usuário não encontrado');
    
    // Atualiza apenas o que foi enviado
    return usuario.update(dados);
  }
  
  async remove(id: string) {
    const usuario = await this.usuarioModel.findByPk(id);
    if (usuario) {
        await usuario.destroy();
        return { message: 'Usuário removido com sucesso' };
    }
    return { message: 'Usuário não encontrado' };
  }
}
