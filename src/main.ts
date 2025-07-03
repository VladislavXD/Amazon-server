import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// Configure CORS for production and development
	app.enableCors({
		origin: true, // Разрешаем все домены временно для отладки
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'Accept',
			'Origin',
			'X-Requested-With'
		],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 200
	})

	app.setGlobalPrefix('api')

	// Use dynamic port for Vercel deployment

	const port = process.env.PORT || 3500

	await app.listen(port)

	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
