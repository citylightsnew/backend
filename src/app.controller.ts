import { Controller, Get, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { Roles } from './auth/decorators/roles.decorator'
import { RolesGuard } from './auth/guards/roles.guard'
import { Role } from './auth/enums/role.enum'

@Controller()
@UseGuards(RolesGuard)
@Roles(Role.USER, Role.ADMIN)
export class AppController {
  constructor (private readonly appService: AppService) {}

  @Get()
  getHello (): string {
    return this.appService.getHello()
  }
}
