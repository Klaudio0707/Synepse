import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsuarioEntidade } from './entities/usuario.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([UsuarioEntidade]),],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService]
})
export class UsuarioModule { }
