import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: 'Alice',
    },
  })
  const newRoom = await prisma.room.create({
    data: {
      name: 'código 2',
      users: {
        create: {
          userId: newUser.id
        }
      }
    },
  })
  console.log('Created new user: ', newUser)

  const allUsers = await prisma.user.findMany({
    include: { rooms: true },
  })
  console.log('All users: ')
  console.dir(allUsers, { depth: null })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
