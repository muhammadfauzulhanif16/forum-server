const pool = require('../../database/postgres/pool')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const container = require('../../container')
const createServer = require('../createServer')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should return 401 response when without authentication', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'post',
        url: '/threads',
        payload: {
          title: 'Thread Title',
          body: 'Thread Body'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(401)
      expect(responseJson.error).toStrictEqual('Unauthorized')
      expect(responseJson.message).toStrictEqual('Missing authentication')
    })

    it('should return 400 response when request does not contain required property', async () => {
      const server = await createServer(container)
      await server.inject({
        method: 'post',
        url: '/users',
        payload: {
          username: 'fauzul',
          password: 'fauzul',
          fullname: 'Fauzul'
        }
      })
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: 'fauzul',
          password: 'fauzul'
        }
      })
      const { accessToken } = JSON.parse(login.payload).data

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads',
        payload: {
          title: 'Thread Title'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(400)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual(
        "Required property doesn't exist"
      )
    })

    it('should return 400 response when request does not meet data type specification', async () => {
      const server = await createServer(container)
      await server.inject({
        method: 'post',
        url: '/users',
        payload: {
          username: 'fauzul',
          password: 'fauzul',
          fullname: 'Fauzul'
        }
      })
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: 'fauzul',
          password: 'fauzul'
        }
      })
      const { accessToken } = JSON.parse(login.payload).data

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads',
        payload: {
          title: ['Thread Title'],
          body: 'Thread Body'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(400)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual("Data type doesn't match")
    })

    it('should return 201 response when creating correct thread', async () => {
      const server = await createServer(container)
      await server.inject({
        method: 'post',
        url: '/users',
        payload: {
          username: 'fauzul',
          password: 'fauzul',
          fullname: 'Fauzul'
        }
      })
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: 'fauzul',
          password: 'fauzul'
        }
      })
      const { accessToken } = JSON.parse(login.payload).data

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads',
        payload: {
          title: 'Thread Title',
          body: 'Thread Body'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(201)
      expect(responseJson.status).toStrictEqual('success')
      expect(responseJson.data.addedThread).toBeDefined()
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 404 when requesting thread not found', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'get',
        url: '/threads/threads-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Thread not found')
    })

    describe('should response 200 when requesting thread is found', () => {
      it('thread details', async () => {
        const server = await createServer(container)
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.createThread({})

        const response = await server.inject({
          method: 'get',
          url: '/threads/thread-123'
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toStrictEqual(200)
        expect(responseJson.status).toStrictEqual('success')
        expect(responseJson.data.thread).toBeDefined()
      })

      it('with comment details', async () => {
        const server = await createServer(container)
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.createThread({})
        await CommentsTableTestHelper.createComment({})

        const response = await server.inject({
          method: 'get',
          url: '/threads/thread-123'
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toStrictEqual(200)
        expect(responseJson.status).toStrictEqual('success')
        expect(responseJson.data.thread.comments).toBeDefined()
      })

      it('with comment details and reply details', async () => {
        const server = await createServer(container)
        await UsersTableTestHelper.addUser({})
        await ThreadsTableTestHelper.createThread({})
        await CommentsTableTestHelper.createComment({})
        await RepliesTableTestHelper.createReply({})

        const response = await server.inject({
          method: 'get',
          url: '/threads/thread-123'
        })

        const responseJson = JSON.parse(response.payload)
        expect(response.statusCode).toStrictEqual(200)
        expect(responseJson.status).toStrictEqual('success')
        expect(responseJson.data.thread.comments[0].replies).toBeDefined()
      })
    })
  })
})
