import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '../../prisma/prisma.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor (
    private jwtService: JwtService,
    private prisma: PrismaService,
    private reflector: Reflector
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)

      // Buscar el usuario con su rol
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true }
      })

      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      request.user = user
      return true
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractTokenFromHeader (request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
