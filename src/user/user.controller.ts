import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UserDto } from './user.dto'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// get profile
	// toggleFavorite
	// updateProfile

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
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



