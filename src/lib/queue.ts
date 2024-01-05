export type JobStatus = 'QUEUED' | 'IN_PROGRESS' | 'CONCLUDED'
export type JobType = 'TIME_CRITICAL' | 'NOT_TIME_CRITICAL'

export interface Job {
    id: number
    type: JobType
    status: JobStatus
}

export interface JobInit {
    type: JobType
}

class JobQueue {
    private static _instance: JobQueue | null = null

    private jobs: Job[] = []
    private jobDetails: {[id: number]: Job} = {}
    private lastId: number = 0

    private constructor() {
        // Private constructor to prevent instantiation from outside the class
    }
  
    public static getInstance(): JobQueue {
        if (!JobQueue._instance) {
            JobQueue._instance = new JobQueue()
        }
    
        return JobQueue._instance
    }
    
    public enqueue(jobInit: JobInit): number | null {
        const jobId = this.lastId + 1
        if (jobId in this.jobDetails) {
            return null
        }

        const job: Job = {
            id: jobId,
            type: jobInit.type,
            status: 'QUEUED'
        }

        this.jobDetails[jobId] = job
        this.jobs.push(job)

        this.lastId += 1

        console.log(`Enqueued job ${JSON.stringify(job)}`)
        return job.id
    }

    public dequeue(): Job | null {
        if (this.jobs.length == 0) {
            return null
        }

        // Skip any concluded jobs in the queue
        let job
        do {
            job = this.jobs.shift()
        } while (job && job.status === 'CONCLUDED')

        if (job) {
            this.jobDetails[job.id].status = 'IN_PROGRESS'
            console.log(`Dequeued job ${JSON.stringify(job)}`)
            return job
        } else {
            console.log(`Could not find any jobs to dequeue`)
            return null
        }
    }

    public conclude(id: number): void {
        if (!(id in this.jobDetails)) {
            console.warn(`Job id ${id} does not exist! Skipping conclude`);
            return
        }

        this.jobDetails[id].status = 'CONCLUDED'
        console.log(`Concluded job id: ${id}`)
    }

    public getJobDetails(id: number): Job | null {
        return id in this.jobDetails ? this.jobDetails[id] : null
    }

    public clearQueue(): void {
        this.jobs = []
        this.jobDetails = {}
        this.lastId = 0
    }
}

export default JobQueue