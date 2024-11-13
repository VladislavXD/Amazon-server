import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { refreshToken } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  // login, GetNewToken Register

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto){
    return this.authService.login(dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')

  async getNewToken(@Body() dto: refreshToken){
    return this.authService.getNewToken(dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')

  async register(@Body() dto: AuthDto){
    return this.authService.register(dto);
  }
}
