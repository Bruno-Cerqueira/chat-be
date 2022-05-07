import { PrismaClient } from '@prisma/client'
import express, { response } from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
})

app.get('/rooms/:userId', async (req, res) => {
  const rooms = await prisma.room.findMany({
    include: {
      users: true
    },
    where: {
      users: {
        some: {
          userId: +req.params.userId
        }
      }
    }
  })
  res.json(rooms);
})

app.get('/room/:id', async (req, res) => {
  const room = await prisma.room.findUnique({
    where: {
      id: +req.params.id
    }
  })
  res.json(room);
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
  res.json(room);
})

app.get('/messages/:roomId', async (req, res) => {
  const rooms = await prisma.message.findMany({
    where: {
      room: {
        id: {
          equals: +req.params.roomId,
        }
      }
    }
  })
  res.json(rooms);
})

app.post('/message', async (req, res) => {
  console.log(req.body)
  const room = await prisma.message.create({
    data: {
      message: req.body.message,
      authorId: req.body.authorId,
      roomId: req.body.roomId,
    },
  })
  res.json(room);
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
