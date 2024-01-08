const assert = require("assert")
const test = require('node:test');

test('Test Queue', async (t) => {

    await t.test('Test enqueue and dequeue', async (t) => {
        const req = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'TIME_CRITICAL'
            })
        }

        const response = await fetch('http://localhost:8080/jobs/enqueue', req)
        const resp = await response.json()
        const expectedId = resp.id

        const response2 = await fetch('http://localhost:8080/jobs/dequeue', {method: 'POST', headers: {'Content-Type': 'application/json'}})
        const resp2 = await response2.json()
        assert.strictEqual(resp2.id, expectedId)
        assert.strictEqual(resp2.type, 'TIME_CRITICAL')
        assert.strictEqual(resp2.status, 'IN_PROGRESS')
    })

    await t.test('Test conclude', async (t) => {
        const req = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'TIME_CRITICAL'
            })
        }

        const response = await fetch('http://localhost:8080/jobs/enqueue', req)
        const resp = await response.json()
        const expectedId = resp.id

        const response2 = await fetch('http://localhost:8080/jobs/dequeue', {method: 'POST', headers: {'Content-Type': 'application/json'}})
        const resp2 = await response2.json()
        assert.strictEqual(resp2.id, expectedId)
        assert.strictEqual(resp2.type, 'TIME_CRITICAL')
        assert.strictEqual(resp2.status, 'IN_PROGRESS')

        const response3 = await fetch(`http://localhost:8080/jobs/${expectedId}/conclude`, {method: 'PUT', headers: {'Content-Type': 'application/json'}})
        const response4 = await fetch(`http://localhost:8080/jobs/${expectedId}`)
        const resp4 = await response4.json()
        assert.strictEqual(resp4.id, expectedId)
        assert.strictEqual(resp4.type, 'TIME_CRITICAL')
        assert.strictEqual(resp4.status, 'CONCLUDED')
    })

    await t.test('Test cancel', async (t) => {
        const req = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'TIME_CRITICAL'
            })
        }

        const response = await fetch('http://localhost:8080/jobs/enqueue', req)
        const resp = await response.json()
        const expectedId = resp.id

        const response3 = await fetch(`http://localhost:8080/jobs/${expectedId}/cancel`, {method: 'PUT', headers: {'Content-Type': 'application/json'}})
        const response4 = await fetch(`http://localhost:8080/jobs/${expectedId}`)
        const resp4 = await response4.json()
        assert.strictEqual(resp4.id, expectedId)
        assert.strictEqual(resp4.type, 'TIME_CRITICAL')
        assert.strictEqual(resp4.status, 'CANCELLED')
    })
})
