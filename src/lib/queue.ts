export type JobStatus = 'QUEUED' | 'IN_PROGRESS' | 'CONCLUDED' | 'CANCELLED'
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

    private criticalJobs: Job[] = []
    private noncriticalJobs: Job[] = []
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
    
    public enqueue(jobInit: JobInit): number {
        const jobId = this.lastId + 1
        const job: Job = {
            id: jobId,
            type: jobInit.type,
            status: 'QUEUED'
        }

        this.jobDetails[jobId] = job
        if (job.type === 'TIME_CRITICAL') {
            this.criticalJobs.push(job)
        } else {
            this.noncriticalJobs.push(job)
        }

        this.lastId += 1

        console.log(`Enqueued job ${JSON.stringify(job)}`)
        return job.id
    }

    public dequeue(): Job | null {
        if (this.criticalJobs.length === 0 && this.noncriticalJobs.length === 0) {
            return null
        }

        // Skip any concluded jobs in the queue
        let job
        do {
            job = this.criticalJobs.shift()
        } while (job && (job.status === 'CONCLUDED' || job.status === 'CANCELLED'))

        if (job === undefined) {
            do {
                job = this.noncriticalJobs.shift()
            } while (job && (job.status === 'CONCLUDED' || job.status === 'CANCELLED'))
        }

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
        this.setJobStatus(id, 'CONCLUDED')
    }
    
    public cancel(id: number): void {
        this.setJobStatus(id, 'CANCELLED')
    }

    public getJobDetails(id: number): Job | null {
        return id in this.jobDetails ? this.jobDetails[id] : null
    }

    public clearQueue(): void {
        this.criticalJobs = []
        this.noncriticalJobs = []
        this.jobDetails = {}
        this.lastId = 0
    }

    private setJobStatus(id: number, status: JobStatus): void {
        if (!(id in this.jobDetails)) {
            console.warn(`Job id ${id} does not exist! Skipping set status`);
            return
        }

        this.jobDetails[id].status = status
        console.log(`Set status ${status} for job id: ${id}`)
    }
}

export default JobQueue