import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Res,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserDto } from './user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { PrismaService } from 'src/prisma.service'
import { Response } from 'express'
import { existsSync, unlinkSync } from 'fs'

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private prisma: PrismaService
	) {}

	// get profile
	// toggleFavorite
	// updateProfile

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@Get('profile/:filename')
	async getProfileImage(
		@Param('filename') filename: string,
		@Res() res: Response
	) {
		// Абсолютный путь
		const imagePath = join(
			process.cwd(),
			'public',
			'uploads',
			'avatars',
			filename
		)

		if (!existsSync(imagePath)) {
			return res.status(404).json({ error: 'File not found' })
		}

		return res.sendFile(imagePath)
	}

	@Post('avatar')
	@Auth()
	@UseInterceptors(
		FileInterceptor('avatar', {
			storage: diskStorage({
				destination: './public/uploads/avatars',
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9)
					const ext = extname(file.originalname)
					callback(null, `avatar-${uniqueSuffix}${ext}`)
				}
			}),
			fileFilter: (req, file, callback) => {
				if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
					return callback(
						new BadRequestException('Only image files are allowed!'),
						false
					)
				}
				callback(null, true)
			},
			limits: { fileSize: 5 * 1024 * 1024 }
		})
	)
	async uploadAvatar(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser('id') userId: number
	) {
		return this.userService.updateAvatar(userId, file)
	}



	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	async getNewToken(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(id, dto)
	}

	@Auth()
	@HttpCode(200)
	@Patch('profile/favorites/:productId')
	async toggleFavorites(
		@Param('productId') productId: string,
		@CurrentUser('id') id: number
	) {
		return this.userService.toggleFavorite(id, +productId)
	}
}
