import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  
   app.enableCors({
    origin: 'https://the-amazon.vercel.app', // ваш домен Next.js с https://
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', // добавьте нужные заголовки, такие как Content-Type
    credentials: true, // если требуется передавать cookies
  });
  app.setGlobalPrefix('api')
  await app.listen(3500); 
}
bootstrap();
 
