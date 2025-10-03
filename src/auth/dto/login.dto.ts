import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string

  @IsString()
  password: string
}
