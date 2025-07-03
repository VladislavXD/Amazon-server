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

		origin: (origin, callback) => {

			// Allow requests with no origin (like mobile apps or curl requests)


			if (!origin) return callback(null, true)


			const allowedOrigins = [

				'http://localhost:3000',

				'https://localhost:3000',

				'http://localhost:3001',

				'https://localhost:3001',

				'https://the-amazon.vercel.app',

				'https://amazon-client-blue.vercel.app'

			]

			// Allow any vercel.app domain

			if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {

				return callback(null, true)

			}

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

			'Access-Control-Allow-Credentials',

			'Access-Control-Allow-Methods',

			'Access-Control-Allow-Headers',


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
