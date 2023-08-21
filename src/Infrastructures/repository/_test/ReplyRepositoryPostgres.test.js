const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres')
const CreateReplyEntity = require('../../../Domains/replies/entities/CreateReplyEntity')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await RepliesTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('createReply', () => {
    it('should create and have created correct reply and have length of 1', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at createReply - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at createReply - ReplyRepositoryPostgres.test'
      })

      const result = await new ReplyRepositoryPostgres(
        pool,
        () => '123'
      ).createReply(
        new CreateReplyEntity({
          content:
            'Reply content at createReply - ReplyRepositoryPostgres.test',
          commentId: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123'
        })
      )

      expect({ ...result }).toStrictEqual({
        id: 'reply-123',
        content: 'Reply content at createReply - ReplyRepositoryPostgres.test',
        owner: 'user-123'
      })
      expect(
        await RepliesTableTestHelper.verifyAvailableReply(result.id)
      ).toHaveLength(1)
    })
  })

  describe('getRepliesByComment', () => {
    it('should return array of reply details when comment is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at getRepliesByComment - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at getRepliesByComment - ReplyRepositoryPostgres.test'
      })
      await RepliesTableTestHelper.createReply({
        content:
          'Reply content at getRepliesByComment - ReplyRepositoryPostgres.test'
      })

      const result = await new ReplyRepositoryPostgres(
        pool,
        {}
      ).getRepliesByComment(['comment-123'])

      expect(result.map((row) => ({ ...row }))).toStrictEqual([
        {
          id: 'reply-123',
          content:
            'Reply content at getRepliesByComment - ReplyRepositoryPostgres.test',
          date: expect.any(Date),
          is_deleted: false,
          comment_id: 'comment-123',
          username: 'fauzul'
        }
      ])
    })
  })

  describe('deleteReply', () => {
    it('should return **balasan telah dihapus** content when is_deleted = true', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at deleteReply - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at deleteReply - ReplyRepositoryPostgres.test'
      })
      await RepliesTableTestHelper.createReply({
        content: 'Reply content at deleteReply - ReplyRepositoryPostgres.test'
      })

      await new ReplyRepositoryPostgres(pool, {}).deleteReply('reply-123')

      const result = await RepliesTableTestHelper.getReply('reply-123')
      expect(result.content).toStrictEqual('**balasan telah dihapus**')
    })
  })

  describe('verifyAvailableReply', () => {
    it('should throw NotFoundError when reply not found', async () => {
      await expect(
        new ReplyRepositoryPostgres(pool, {}).verifyAvailableReply('reply-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when reply is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyAvailableReply - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyAvailableReply - ReplyRepositoryPostgres.test'
      })
      await RepliesTableTestHelper.createReply({
        content:
          'Reply content at verifyAvailableReply - ReplyRepositoryPostgres.test'
      })

      await expect(
        new ReplyRepositoryPostgres(pool, {}).verifyAvailableReply('reply-123')
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyReplyOwner', () => {
    it('should throw AuthorizationError when reply is not owned by user', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })
      await RepliesTableTestHelper.createReply({
        content:
          'Reply content at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })

      await expect(
        new ReplyRepositoryPostgres(pool, {}).verifyReplyOwner({
          id: 'reply-123',
          owner: 'user-456'
        })
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when reply is owned by user', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })
      await RepliesTableTestHelper.createReply({
        content:
          'Reply content at verifyReplyOwner - ReplyRepositoryPostgres.test'
      })

      await expect(
        new ReplyRepositoryPostgres(pool, {}).verifyReplyOwner({
          id: 'reply-123',
          owner: 'user-123'
        })
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })
})
