import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// Configure CORS for production and development
	app.enableCors({
  origin: [
				'http://localhost:3000',
				'https://localhost:3000',
				'http://localhost:3001',
				'https://localhost:3001',
				'https://the-amazon.vercel.app',
				'https://amazon-client-blue.vercel.app',
				'https://amazon-server-jade.vercel.app',
				'https://amazon-client-6tb2ry6ts-vladislavdevs-projects.vercel.app/'
  ],
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
		optionsSuccessStatus: 204
})

	app.setGlobalPrefix('api')

	// Use dynamic port for Vercel deployment

	const port = process.env.PORT || 3500

	await app.listen(port)

	console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
