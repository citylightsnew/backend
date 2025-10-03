import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Role } from '../auth/enums/role.enum'

@Controller('roles')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
export class RolesController {
  constructor (private readonly rolesService: RolesService) {}

  @Post()
  create (@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  findAll () {
    return this.rolesService.findAll()
  }

  @Get(':id')
  findOne (@Param('id') id: string) {
    return this.rolesService.findOne(id)
  }

  @Patch(':id')
  update (@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  remove (@Param('id') id: string) {
    return this.rolesService.remove(id)
  }
}
