import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  
    app.enableCors({
    origin: 'the-amazon.vercel.app/', // укажите ваш домен Next.js
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Access-Control-Allow-Origin', // добавьте необходимые заголовки
    credentials: true, // если нужно передавать cookies
  });
  app.setGlobalPrefix('api')
  await app.listen(3500); 
}
bootstrap();
 
