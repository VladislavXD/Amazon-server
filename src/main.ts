import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// Configure CORS for production and development
	app.enableCors({
		origin: (origin, callback) => {
			console.log('CORS Origin Check:', origin);
			
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true)

			const allowedOrigins = [
				'http://localhost:3000',
				'https://localhost:3000',
				'http://localhost:3001',
				'https://localhost:3001',
				'https://the-amazon.vercel.app',
				'https://amazon-client-blue.vercel.app',
				// Добавляем поддержку переменных окружения для динамических доменов
				process.env.FRONTEND_URL,
				process.env.CLIENT_URL
			].filter(Boolean) // Убираем undefined значения
			
			// Allow any vercel.app domain or specifically allowed origins
			if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
				console.log('CORS Origin ALLOWED:', origin);
				return callback(null, true)
			}
			
			console.log('CORS Origin DENIED:', origin);
			console.log('Allowed origins:', allowedOrigins);
			callback(new Error('Not allowed by CORS'))
		},
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: [
			'Content-Type',
			'Authorization',
			'Accept',
			'Origin',
			'X-Requested-With',
			'Access-Control-Allow-Origin',
			'Access-Control-Allow-Headers',
			'Access-Control-Allow-Methods'
		],
		exposedHeaders: [
			'Access-Control-Allow-Origin',
			'Access-Control-Allow-Headers'
		],
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204
	})

	app.setGlobalPrefix('api')

	// Use dynamic port for Vercel deployment

	const port = process.env.PORT || 3500

	await app.listen(port)

	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
