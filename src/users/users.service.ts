import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor (private prisma: PrismaService) {}

  async create (createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email }
    })

    if (existing) throw new ConflictException('User with this email already exists')

    let roleId = createUserDto.roleId
    if (!roleId) {
      const userRole = await this.prisma.role.findUnique({ where: { name: 'user' } })
      if (!userRole) throw new NotFoundException('Rol "user" not found')
      roleId = userRole.id
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12)

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        roleId,
        password: hashedPassword
      }
    })
  }

  findAll (): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  findByEmail (email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  findOne (id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  update (id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existing = this.prisma.user.findUnique({
      where: { id }
    })

    if (!existing) throw new NotFoundException('User not found')

    const updatedData = { ...updateUserDto }
    if (updateUserDto.password) {
      updatedData.password = bcrypt.hashSync(updateUserDto.password, 12)
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto
    })
  }

  async markVerified (id: string): Promise<User> {
    const existing = await this.prisma.user.findUnique({
      where: { id }
    })
    if (!existing) throw new NotFoundException('User not found')

    return this.prisma.user.update({
      where: { id },
      data: { verified: true }
    })
  }

  remove (id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id }
    })
  }
}
