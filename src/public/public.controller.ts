import { Controller, Get } from '@nestjs/common'
import { Public } from '../auth/decorators/public.decorator'

@Controller('public')
@Public()
export class PublicController {
  @Get()
  getPublicInfo (): string {
    return 'Esta es una ruta pública accesible sin autenticación'
  }

  @Get('health')
  healthCheck (): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API funcionando correctamente'
    }
  }
}
