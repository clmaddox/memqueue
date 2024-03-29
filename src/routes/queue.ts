import { Router } from "express"
import { enqueue, dequeue, conclude, cancel, getJobDetails } from "../service/queue"

class QueueRoutes {
  router = Router()

  constructor() {
    this.intializeRoutes()
  }

  private intializeRoutes() {
    this.router.post("/enqueue", enqueue)
    this.router.post("/dequeue", dequeue)
    this.router.put('/:jobId/conclude', conclude)
    this.router.put('/:jobId/cancel', cancel)
    this.router.get('/:jobId', getJobDetails)
  }
}

export default new QueueRoutes().router