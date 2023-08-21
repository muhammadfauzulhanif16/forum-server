const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const createServer = require('../createServer')
const container = require('../../container')

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should return 401 response when without authentication', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'post',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'Reply Content'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(401)
      expect(responseJson.error).toStrictEqual('Unauthorized')
      expect(responseJson.message).toStrictEqual('Missing authentication')
    })

    it('should return 404 response when thread not found', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'Reply Content'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Thread not found')
    })

    it('should return 404 response when comment not found', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'Reply Content'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Comment not found')
    })

    it('should return 400 response when request does not contain required property', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {}
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
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: ['Reply Content']
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(400)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual("Data type doesn't match")
    })

    it('should return 201 response when creating correct reply', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })

      const response = await server.inject({
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: {
          content: 'Reply Content'
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(201)
      expect(responseJson.status).toStrictEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}}', () => {
    it('should return 401 response when without authentication', async () => {
      const server = await createServer(container)

      const response = await server.inject({
        method: 'delete',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(401)
      expect(responseJson.error).toStrictEqual('Unauthorized')
      expect(responseJson.message).toStrictEqual('Missing authentication')
    })

    it('should return 404 response when thread not found', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data

      const response = await server.inject({
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Thread not found')
    })

    it('should return 404 response when comment not found', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })

      const response = await server.inject({
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Comment not found')
    })

    it('should return 404 response when reply not found', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })

      const response = await server.inject({
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(404)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Reply not found')
    })

    it('should return 403 response when reply is not owned by user', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'hanif' })
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })
      await RepliesTableTestHelper.createReply({ owner: 'user-456' })

      const response = await server.inject({
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(403)
      expect(responseJson.status).toStrictEqual('fail')
      expect(responseJson.message).toStrictEqual('Unauthorized')
    })

    it('should return response 200 when deleting reply', async () => {
      const server = await createServer(container)
      const userPayload = {
        username: 'fauzul',
        password: 'fauzul',
        fullname: 'Fauzul'
      }
      const user = await server.inject({
        method: 'post',
        url: '/users',
        payload: userPayload
      })
      const { id: userId } = JSON.parse(user.payload).data.addedUser
      const login = await server.inject({
        method: 'post',
        url: '/authentications',
        payload: {
          username: userPayload.username,
          password: userPayload.password
        }
      })
      const { accessToken } = JSON.parse(login.payload).data
      await ThreadsTableTestHelper.createThread({ owner: userId })
      await CommentsTableTestHelper.createComment({ owner: userId })
      await RepliesTableTestHelper.createReply({ owner: userId })

      const response = await server.inject({
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123'
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toStrictEqual(200)
      expect(responseJson.status).toStrictEqual('success')
    })
  })
})
