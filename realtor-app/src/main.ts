import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Ensure all endpoints are protected from receiving incorrect data. The validation are in DTOs (report.dto.ts)
      whitelist: true, // Only allow receive properties that are explicitly defined in the DTO
      transform: true, // Automatically transform the data to the correct type. It's necessary the config in app.module.ts
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit conversion of data types. It's necessary the config in app.module.ts
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
