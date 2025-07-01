import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Configure CORS for production and development
    app.enableCors({
      origin: true, // Allow all origins for now to debug
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'], 
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    app.setGlobalPrefix('api')
    
    // Use dynamic port for Vercel deployment
    const port = process.env.PORT || 3500;
    await app.listen(port); 
    
    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Server listening on port: ${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}
bootstrap();