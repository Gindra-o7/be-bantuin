import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS Dinamis
  app.enableCors({
    origin: (origin, callback) => {
      const frontendUrl = configService.get<string>('FRONTEND_URL');

      // 1. Izinkan request tanpa origin (misal: server-to-server atau Postman)
      if (!origin) {
        return callback(null, true);
      }

      // 2. Logic Validasi Origin
      // Izinkan jika:
      // a. Sama dengan FRONTEND_URL di .env
      // b. Adalah Localhost (port berapapun)
      // c. Adalah domain Ngrok (ngrok-free.dev)
      if (
        origin === frontendUrl ||
        origin.startsWith('http://localhost') ||
        origin.includes('.ngrok-free.dev') ||
        origin.includes('.ngrok.io')
      ) {
        callback(null, true);
      } else {
        console.warn(`CORS Blocked for origin: ${origin}`);
        callback(null, false); // Block request
      }
    },
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api');

  // Terapkan Validasi Zod secara Global
  app.useGlobalPipes(new ZodValidationPipe());

  const port = configService.get<number>('PORT') || 5500;
  await app.listen(port);
  console.log(`Server is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});
