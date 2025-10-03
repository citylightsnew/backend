import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener como máximo 50 caracteres' })
  name: string

  @IsString()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(128, { message: 'La contraseña debe tener como máximo 128 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial (@$!%*?&)'
    }
  )
  password: string

  @IsOptional()
  verified?: boolean

  @IsOptional()
  @IsString()
  telephone?: string

  @IsOptional()
  @IsString()
  roleId?: string
}
