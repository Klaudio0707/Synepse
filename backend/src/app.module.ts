import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TicketModule } from './ticket/ticket.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from "dotenv"
import { DatabaseModule } from './database/database.module';

dotenv.config()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsuarioModule,
    TicketModule,
    PacienteModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
