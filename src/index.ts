import { PrismaClient } from '@prisma/client'
import express, { response } from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/users', async (req, res) => {

  const users = await prisma.user.findMany()
  res.json(users)
})

app.get('/rooms/:id', async (req, res) => {
  const rooms = await prisma.room.findMany({
    include: {
      users: true
    },
    where: {
      users: {
        some: {
          userId: +req.params.id
        }
      }
    }
  })
  console.log(rooms)
  res.json(rooms)
})

app.get('/room/:id', async (req, res) => {
  const room = await prisma.room.findUnique({
    where: {
      id: +req.params.id
    }
  })
  res.json(room)
})

app.post('/room', async (req, res) => {
  console.log(req.body)
  const room = await prisma.room.create({
    data: {
      name: req.body.name,
      users: {
        create: {
          userId: req.body.userId
        }
      }
    },
  })

  res.json(room)
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
