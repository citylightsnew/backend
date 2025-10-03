import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service'
import { EmailService } from '../mail/email.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { ResendVerificationDto } from './dto/resend-verification.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { Role } from './enums/role.enum'

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {}

  private generateVerificationCode (): string {
    return crypto.randomInt(100000, 999999).toString()
  }

  private async hashCode (code: string): Promise<string> {
    return bcrypt.hash(code, 10)
  }

  async register (registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    })

    if (existingUser) {
      throw new ConflictException('El usuario con este email ya existe')
    }

    const userRole = await this.prisma.role.findUnique({
      where: { name: Role.USER }
    })

    if (!userRole) {
      throw new NotFoundException('Rol "user" no encontrado')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12)

    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        roleId: userRole.id,
        verified: false
      }
    })

    // Generar y enviar código de verificación
    const verificationCode = this.generateVerificationCode()
    const hashedCode = await this.hashCode(verificationCode)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos

    // Guardar código de verificación en la base de datos
    await this.prisma.verificationCode.create({
      data: {
        codeHash: hashedCode,
        userId: user.id,
        expiresAt,
        used: false,
        attempts: 0
      }
    })

    // Enviar email de verificación
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.name || 'Usuario',
        verificationCode
      )
    } catch (error) {
      // Si falla el envío de email, eliminar el usuario creado
      await this.prisma.user.delete({ where: { id: user.id } })
      throw new ConflictException('Error al enviar el email de verificación')
    }

    return {
      message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified
      },
      needsVerification: true
    }
  }

  async login (loginDto: LoginDto) {
    // Buscar usuario con su rol
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { role: true }
    })

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name
    }

    const token = await this.jwtService.signAsync(payload)

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: user.verified
      },
      access_token: token
    }
  }

  async verifyEmail (verifyEmailDto: VerifyEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: verifyEmailDto.email },
      include: { role: true }
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    if (user.verified) {
      throw new BadRequestException('El usuario ya está verificado')
    }

    // Buscar el código de verificación más reciente y no usado
    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        used: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!verificationCode) {
      throw new BadRequestException('Código de verificación inválido o expirado')
    }

    // Verificar si ya se alcanzó el límite de intentos
    if (verificationCode.attempts >= 3) {
      throw new BadRequestException('Límite de intentos excedido. Solicita un nuevo código.')
    }

    // Verificar el código
    const isCodeValid = await bcrypt.compare(verifyEmailDto.code, verificationCode.codeHash)

    if (!isCodeValid) {
      // Incrementar intentos
      await this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { attempts: verificationCode.attempts + 1 }
      })
      throw new BadRequestException('Código de verificación incorrecto')
    }

    // Marcar código como usado y usuario como verificado
    await this.prisma.$transaction([
      this.prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { used: true }
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { verified: true }
      })
    ])

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name
    }

    const token = await this.jwtService.signAsync(payload)

    return {
      message: 'Email verificado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        verified: true
      },
      access_token: token
    }
  }

  async resendVerificationCode (resendDto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: resendDto.email }
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    if (user.verified) {
      throw new BadRequestException('El usuario ya está verificado')
    }

    // Invalidar códigos anteriores
    await this.prisma.verificationCode.updateMany({
      where: {
        userId: user.id,
        used: false
      },
      data: { used: true }
    })

    // Generar nuevo código
    const verificationCode = this.generateVerificationCode()
    const hashedCode = await this.hashCode(verificationCode)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await this.prisma.verificationCode.create({
      data: {
        codeHash: hashedCode,
        userId: user.id,
        expiresAt,
        used: false,
        attempts: 0
      }
    })

    // Enviar nuevo email
    await this.emailService.sendVerificationEmail(
      user.email,
      user.name || 'Usuario',
      verificationCode
    )

    return {
      message: 'Nuevo código de verificación enviado'
    }
  }
}
