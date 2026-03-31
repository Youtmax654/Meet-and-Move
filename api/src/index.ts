import { Hono } from 'hono'
import messagesRoute from './features/messages/messages.routes'
import activitiesRoute from './features/activities/activities.routes'

const app = new Hono()

app.get('/', (c) => {
  return c.json({
    status: "ok",
    message: "Welcome to the Meet and Move API",
  })
})

app.route("/messages", messagesRoute)
app.route("/activities", activitiesRoute)

export default app
