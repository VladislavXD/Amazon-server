import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
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
import { diskStorage } from 'multer';
import { extname } from 'path'
import { PrismaService } from 'src/prisma.service'

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService ,
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
	// @Post('avatar')
	// @Auth()
	// @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './public/uploads/avatars', // куда сохранять
  //     filename: (req, file, callback) => {
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //       const ext = extname(file.originalname);
  //       callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  //     },
  //   }),
  //   limits: { fileSize: 5 * 1024 * 1024 }, // до 5 MB
  // }))
	// async uploadAvatar(
  //   @UploadedFile() file: Express.Multer.File,
  //   @CurrentUser('id') userId: number,
  // ) {
  //   const avatarUrl = `/uploads/avatars/${file.filename}`;

  //   await this.prisma.user.update({
  //     where: { id: userId },
  //     data: { avatarUrl },
  //   });

  //   return { avatarUrl };
  // }


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



