import { Injectable } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '@prisma/client'

@Injectable()
export class RolesService {
  constructor (private prisma: PrismaService) {}

  async create (createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name }
    })

    if (existing) throw new Error('Role already exists')

    return this.prisma.role.create({
      data: createRoleDto
    })
  }

  findAll (): Promise<Role[]> {
    return this.prisma.role.findMany()
  }

  findOne (id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id }
    })
  }

  update (id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto
    })
  }

  remove (id: string): Promise<Role> {
    return this.prisma.role.delete({
      where: { id }
    })
  }
}
