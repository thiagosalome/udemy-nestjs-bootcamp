import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Ensure all endpoints are protected from receiving incorrect data.
      whitelist: true, // Only allow properties that are explicitly defined in the DTO
    }),
  );
  await app.listen(3000);
}
bootstrap();
