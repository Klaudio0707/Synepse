import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('TESTE DE URL:', process.env.DATABASE_URL ? 'URL ENCONTRADA' : 'URL NÃO ENCONTRADA (UNDEFINED)');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
