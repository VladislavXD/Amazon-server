import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// Handle preflight requests explicitly
	app.use((req, res, next) => {
		if (req.method === 'OPTIONS') {
			const origin = req.headers.origin;
			console.log('Preflight request from origin:', origin);
			
			// Allow all vercel.app domains and localhost
			if (!origin || origin.endsWith('.vercel.app') || 
				origin.includes('localhost') || 
				['https://the-amazon.vercel.app', 'https://amazon-client-blue.vercel.app'].includes(origin)) {
				
				res.header('Access-Control-Allow-Origin', origin || '*');
				res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
				res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
				res.header('Access-Control-Allow-Credentials', 'true');
				res.header('Access-Control-Max-Age', '86400');
				
				console.log('Preflight approved for:', origin);
				return res.status(200).end();
			}
			
			console.log('Preflight denied for:', origin);
		}
		next();
	});

	// Configure CORS for production and development
	app.enableCors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true)

			// Allow all vercel.app domains and localhost
			if (origin.endsWith('.vercel.app') || origin.includes('localhost') ||
				['https://the-amazon.vercel.app', 'https://amazon-client-blue.vercel.app'].includes(origin)) {
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
