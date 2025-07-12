import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'


async function bootstrap() {
	try {
		console.log('Starting application...')
		console.log('Environment check:')
		console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
		console.log('NODE_ENV:', process.env.NODE_ENV)
		
		const app = await NestFactory.create<NestExpressApplication>(AppModule, { 
			cors: true,
			logger: ['error', 'warn', 'log']
		})
 
		app.enableCors({
			origin: true, // Разрешаем все 
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
	} catch (error) {
		console.error('Failed to start application:', error)
		process.exit(1)
	}
}

bootstrap()
