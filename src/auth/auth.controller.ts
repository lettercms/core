import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GmailDto } from './dto/gmail.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() loginDto: LoginDto) {
    return this.authService.signin(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('gmail')
  gmail(@Body() gmailDto: GmailDto) {
    return this.authService.gmail(gmailDto);
  }
}
