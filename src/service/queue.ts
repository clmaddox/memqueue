import { Request, Response } from "express"
import JobQueue, { Job } from "../lib/queue"

export function enqueue(req: Request, res: Response): Response {
    // TODO: validate the job data being passed in
    const job: Job = req.body
    const queue = JobQueue.getInstance()
    const queuedJobId = queue.enqueue(job)
    if (queuedJobId === null) {
        return res.sendStatus(409)
    }

    return res.json({ id: queuedJobId })
}

export function dequeue(req: Request, res: Response): Response {
    const queue = JobQueue.getInstance()
    const dequeuedJob = queue.dequeue()
    if (dequeuedJob === null) {
        return res.sendStatus(404)
    }

    return res.json(dequeuedJob)
}

export function conclude(req: Request, res: Response): Response {
    const queue = JobQueue.getInstance()
    const params = req.params
    // TODO: validate job ids
    queue.conclude(parseInt(params['jobId']))
    return res.sendStatus(200)
}

export function getJobDetails(req: Request, res: Response): Response {
    const queue = JobQueue.getInstance()
    const params = req.params
    // TODO: validate job ids
    const jobDetails = queue.getJobDetails(parseInt(params['jobId']))
    if (jobDetails === null) {
        return res.sendStatus(404)
    } else {
        return res.json(jobDetails)
    }
}