import { Hono } from 'hono'
import messagesRoute from './features/messages/messages.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  })
})

app.route("/messages", messagesRoute)

export default app
