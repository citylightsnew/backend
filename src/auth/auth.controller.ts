import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { ResendVerificationDto } from './dto/resend-verification.dto'
import { Public } from './decorators/public.decorator'

@Controller('auth')
@Public()
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('register')
  async register (@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login (@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail (@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto)
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification (@Body() resendDto: ResendVerificationDto) {
    return this.authService.resendVerificationCode(resendDto)
  }
}
