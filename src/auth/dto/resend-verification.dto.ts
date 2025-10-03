import { IsEmail, IsString } from 'class-validator'

export class ResendVerificationDto {
  @IsString()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string
}
