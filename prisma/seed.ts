import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main () {
  console.log('🌱 Seeding database...')

  // Crear roles por defecto
  const roles = ['public', 'user', 'admin']

  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName
      }
    })
    console.log(`✅ Role "${roleName}" created/updated`)
  }

  // Crear usuario admin por defecto
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  })

  if (adminRole) {
    const adminPassword = await bcrypt.hash('admin123', 12)

    await prisma.user.upsert({
      where: { email: 'admin@citylights.com' },
      update: {},
      create: {
        name: 'Administrador City Lights',
        email: 'admin@citylights.com',
        password: adminPassword,
        verified: true,
        roleId: adminRole.id
      }
    })
    console.log('✅ Admin user created/updated: admin@citylights.com')
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
