import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});


  
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'localhost:3000',
      'https://the-amazon.vercel.app',
      'http://the-amazon.vercel.app',
      'https://localhost:3000',
      'the-amazon.vercel.app'
            ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization', 
    credentials: true, 
  });

  app.setGlobalPrefix('api')
  
  // Use dynamic port for Vercel deployment
  const port = process.env.PORT || 3500;
  await app.listen(port); 
  
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();