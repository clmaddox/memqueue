import JobQueue from '../../src/lib/queue'

describe('Test Queue', () => {
    let queue: JobQueue

    beforeEach(() => {
        queue = JobQueue.getInstance()
    })

    afterEach(() => {
        queue.clearQueue()
    })

    test('Enqueue should add a job to the queue', () => {
        const expectedId = queue.enqueue({
            type: 'TIME_CRITICAL'
        })

        // Here to make TS happy
        if (expectedId === null) {
            expect(expectedId).not.toBeNull()
            return
        }

        const queuedJob = queue.getJobDetails(expectedId)
        expect(queuedJob).not.toBeNull()
        
        expect(queuedJob?.id).toEqual(expectedId)
        expect(queuedJob?.type).toEqual('TIME_CRITICAL')
        expect(queuedJob?.status).toEqual('QUEUED')
    })

    test('Dequeue should get the first job from the queue', () => {
        const expectedId1 = queue.enqueue({
            type: 'TIME_CRITICAL'
        })
        const expectedId2 = queue.enqueue({
            type: 'TIME_CRITICAL'
        })

        // Here to make TS happy
        if (expectedId1 === null || expectedId2 === null) {
            expect(expectedId1).not.toBeNull()
            expect(expectedId2).not.toBeNull()
            return
        }

        const queuedJob = queue.dequeue()
        expect(queuedJob).not.toBeNull()

        expect(queuedJob?.id).toEqual(expectedId1)
        expect(queuedJob?.type).toEqual('TIME_CRITICAL')
        expect(queuedJob?.status).toEqual('IN_PROGRESS')

        const queuedJob2 = queue.dequeue()
        expect(queuedJob2).not.toBeNull()

        expect(queuedJob2?.id).toEqual(expectedId2)
    })

    test('Conclude should mark a job concluded', () => {
        const expectedId = queue.enqueue({
            type: 'TIME_CRITICAL'
        })

        // Here to make TS happy
        if (expectedId === null) {
            expect(expectedId).not.toBeNull()
            return
        }

        const queuedJob = queue.dequeue()
        expect(queuedJob).not.toBeNull()

        expect(queuedJob?.id).toEqual(expectedId)
        expect(queuedJob?.type).toEqual('TIME_CRITICAL')
        expect(queuedJob?.status).toEqual('IN_PROGRESS')

        queue.conclude(expectedId)
        const job = queue.getJobDetails(expectedId)
        expect(job?.id).toEqual(expectedId)
        expect(job?.status).toEqual('CONCLUDED')
    })

    // TODO: Add a test to verify skipping concluded jobs in queue
    // TODO: Add a couple tests to verify error/missing data cases of queue functions
})