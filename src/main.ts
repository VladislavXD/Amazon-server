import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// Configure CORS for production and development
// 	app.enableCors({
//   origin: [
//     'https://the-amazon.vercel.app',
//     'https://amazon-client-blue.vercel.app',
//     'http://localhost:3000'
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   credentials: true,
//   optionsSuccessStatus: 204
// })

	app.enableCors({
		origin: true, // автоматически возвращает Origin-заголовок обратно
		credentials: true
	})

	app.setGlobalPrefix('api')

	// Use dynamic port for Vercel deployment

	const port = process.env.PORT || 3500

	await app.listen(port)

	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
