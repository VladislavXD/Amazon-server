import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseFilePipe,
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
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly prisma: PrismaService
	) {}

	// get profile
	// toggleFavorite
	// updateProfile

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	// @Get('profile/:filename')
	// async getProfileImage(
	// 	@Param('filename') filename: string,
	// 	@Res() res: Response
	// ) {
	// 	// Абсолютный путь
	// 	const imagePath = join(
	// 		process.cwd(),
	// 		'public',
	// 		'uploads',
	// 		'avatars',
	// 		filename
	// 	)

	// 	if (!existsSync(imagePath)) {
	// 		return res.status(404).json({ error: 'File not found' })
	// 	}

	// 	return res.sendFile(imagePath)
	// }

@Post("avatar")
@Auth()
@UseInterceptors(
  FileInterceptor("avatar", {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
        return cb(
          new BadRequestException("Only image files are allowed!"),
          false
        );
      }
      cb(null, true);
    },
  })
)
async uploadAvatar(
  @UploadedFile() file: Express.Multer.File,
  @CurrentUser("id") userId: number,
) {
  if (!file) {
    throw new BadRequestException("No file uploaded");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new BadRequestException("Only images are allowed");
  }

  const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPublicId: true },
    });

  const uploadResult = await this.cloudinaryService.uploadImage(file.buffer, "avatars");


  if (user?.avatarPublicId) {
    await this.cloudinaryService.deleteImage(user.avatarPublicId).catch((err) => {
      console.error("Failed to delete previous avatar:", err);
    });
  }
  
  const updatedUser = await this.prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: uploadResult.url,
      avatarPublicId: uploadResult.publicId,
     },
    select: {
      id: true,
      email: true,
      avatarUrl: true,
    },
  });

  return {
    message: "Avatar uploaded successfully",
    avatarUrl: uploadResult.url,
    user: updatedUser,
  };
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
