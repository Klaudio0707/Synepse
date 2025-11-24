import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TicketModule } from './ticket/ticket.module';
import { PacienteModule } from './paciente/paciente.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    UsuarioModule,
     TicketModule,
      PacienteModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}
