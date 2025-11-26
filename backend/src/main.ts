import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Teste de conexao com a variavel de ambiente
  console.log('TESTE DE URL:', process.env.DATABASE_URL ? 'URL ENCONTRADA' : 'URL NÃO ENCONTRADA (UNDEFINED)');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
