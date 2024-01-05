# Introduction
`memqueue` is an in memory queue implementation in typescript. Express is used to simplify the route handling and jest is used for unit testing.

# Running memqueue
`memqueue` was built on node version `v20.10.0`, so we recommend using that. Before running memqueue, make sure to install dependencies:

```
npm install
```

If this is a first time install, create a new `.env` file based on the template `.env.example` file. Update any values as needed.
```
cp .env.example .env
```

To verify memqueue is installed properly, run the unit tests:
```
npm run test
```

If all tests pass, run the server:
```
npm run start
```

NOTE: Running the `start` command will also generate a build. This can be found in the `build` directory.

After the server has started, run the endpoint tests to verify it is working properly:
```
npm run test-endpoints
```

# Manual Testing
Here are some example commands for manual testing using the httpie package

```
# ENQUEUE
echo -n '{"type": "TIME_CRITICAL"}' | http POST localhost:8080/jobs/enqueue

# GET JOB DETAILS
http GET localhost:8080/jobs/<id>

# DEQUEUE
http POST localhost:8080/jobs/dequeue

# CONCLUDE
http PUT localhost:8080/jobs/<id>/conclude
```

# Assumptions
1. We are not worried about security. We could add some sort of authentication via tokens if needed.
2. Job details are not deleted. We could delete the details once it has been concluded and it has been cleared from the queue. You would lose history, but the memory wouldn't grow infinitely. We could also seach for the job in the queue at the time of conclusion or add a timed auto delete.
3. Queue is unconstrained. You can add as many jobs as you have available memory.
4. We are assuming that the jobs being passed in will have at least a type. 

# Possible Improvements
1. I am using the JS built in array functions to handle the queue. If efficiency was a problem, we could consider building the queue as a linked list instead.
2. I am using the built in node `console.log()` functions for logging. In a production system, it would be better to use a logging library to make it easier to have structured logs. I've used `winston` in the past with success.
3. Should consider using a uuid instead of an integer for job ids.
3. The service should be containerized for easier deployments and portability.
4. It would be useful to include a `/stats` endpoint to give some general information about the queue state. Could also have a third party metrics system that the data is sent to.
5. Would be interesting to add an extra priority feature. This would allow certain jobs to take precedence over others. Could piggyback off of the job `type` for this or create a new field.
6. Should create a CI component for github to auto run tests when commits occur.
