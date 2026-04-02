import { Hono } from 'hono'
import { cors } from 'hono/cors'
import messagesRoute from './features/messages/messages.routes'
import feedRoute from './features/feed/feed.route'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  })
})

app.route("/messages", messagesRoute)
app.route("/feed", feedRoute)

export default app
