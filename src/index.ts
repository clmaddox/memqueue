import express, { Application } from "express"
import QueueRoutes from "./routes/queue"

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/jobs", QueueRoutes)

app.listen(PORT, "localhost", function () {
  console.log(`Server is running on port ${PORT}.`)
}).on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error("Error: address already in use")
  } else {
    console.error(err)
  }
})