import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  
   app.enableCors({
    origin: 'https://amazon-frontend.vercel.app', // укажите ваш домен Next.js
    methods: 'GET, POST, PUT, DELETE', 'PATCH'
    allowedHeaders: 'Content-Type, Authorization', // добавьте необходимые заголовки
    credentials: true, // если нужно передавать cookies
  });
  app.setGlobalPrefix('api')
  await app.listen(3500); 
}
bootstrap();
 
