
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ورود پرسنل به پنل' })
  @ApiOkResponse({ description: 'ورود موفق و دریافت توکن' })
  @ApiUnauthorizedResponse({
    description: 'اطلاعات ورود نامعتبر یا حساب غیرفعال است',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
