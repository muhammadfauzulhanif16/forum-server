const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const pool = require('../../database/postgres/pool')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const CreateCommentEntity = require('../../../Domains/comments/entities/CreateCommentEntity')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('createComment', () => {
    it('should create and have created correct comment and have length of 1', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at createComment - CommentRepositoryPostgres.test'
      })

      const result = await new CommentRepositoryPostgres(
        pool,
        () => '123'
      ).createComment(
        new CreateCommentEntity({
          content:
            'Comment content at createComment - CommentRepositoryPostgres.test',
          threadId: 'thread-123',
          owner: 'user-123'
        })
      )

      expect({ ...result }).toStrictEqual({
        id: 'comment-123',
        content:
          'Comment content at createComment - CommentRepositoryPostgres.test',
        owner: 'user-123'
      })
      expect(
        await CommentsTableTestHelper.verifyAvailableComment(result.id)
      ).toHaveLength(1)
    })
  })

  describe('createLike', () => {
    it('should create like and have length of 1', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at createLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at createLike - CommentRepositoryPostgres.test'
      })

      await new CommentRepositoryPostgres(pool, {}).createLike({
        commentId: 'comment-123',
        owner: 'user-123'
      })

      expect(
        await CommentsTableTestHelper.getLikesByComment(['comment-123'])
      ).toHaveLength(1)
    })
  })

  describe('getCommentsByThread', () => {
    it('should return array of comment details when thread is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at getCommentsByThread - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at getCommentsByThread - CommentRepositoryPostgres.test'
      })

      const result = await new CommentRepositoryPostgres(
        pool,
        {}
      ).getCommentsByThread('thread-123')

      expect(result.map((row) => ({ ...row }))).toStrictEqual([
        {
          id: 'comment-123',
          content:
            'Comment content at getCommentsByThread - CommentRepositoryPostgres.test',
          date: expect.any(Date),
          username: 'fauzul'
        }
      ])
    })
  })

  describe('getLikesByComment', () => {
    it('should return array of likes when comment is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at getLikesByComment - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at getLikesByComment - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createLike({})

      const result = await new CommentRepositoryPostgres(
        pool,
        {}
      ).getLikesByComment(['comment-123'])

      expect(result).toHaveLength(1)
    })
  })

  describe('deleteComment', () => {
    it('should return is_deleted = true', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at deleteComment - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at deleteComment - CommentRepositoryPostgres.test',
        isDeleted: true
      })

      await new CommentRepositoryPostgres(pool, {}).deleteComment('comment-123')

      const result = await CommentsTableTestHelper.getComment('comment-123')
      expect(result.content).toStrictEqual('**komentar telah dihapus**')
    })
  })

  describe('deleteLike', () => {
    it('should delete like and have length of 0', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at deleteLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at deleteLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createLike({})

      await new CommentRepositoryPostgres(pool, {}).deleteLike({
        commentId: 'comment-123',
        owner: 'user-123'
      })

      expect(
        await CommentsTableTestHelper.getLikesByComment(['comment-123'])
      ).toHaveLength(0)
    })
  })

  describe('verifyAvailableComment', () => {
    it('should throw NotFoundError when comment not found', async () => {
      await expect(
        new CommentRepositoryPostgres(pool, {}).verifyAvailableComment(
          'comment-123'
        )
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyAvailableComment - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyAvailableComment - CommentRepositoryPostgres.test'
      })

      await expect(
        new CommentRepositoryPostgres(pool, {}).verifyAvailableComment(
          'comment-123'
        )
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyAvailableLike', () => {
    it('should return false when like comment not found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyAvailableLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyAvailableLike - CommentRepositoryPostgres.test'
      })

      const result = await new CommentRepositoryPostgres(
        pool,
        {}
      ).verifyAvailableLike({
        commentId: 'comment-123',
        owner: 'user-123'
      })

      await expect(result).toBeFalsy()
    })

    it('should return true when like comment is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyAvailableLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyAvailableLike - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createLike({})

      const result = await new CommentRepositoryPostgres(
        pool,
        {}
      ).verifyAvailableLike({
        commentId: 'comment-123',
        owner: 'user-123'
      })

      expect(result).toBeTruthy()
    })
  })

  describe('verifyCommentOwner', () => {
    it('should throw AuthorizationError when comment is not owned by user', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyCommentOwner - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyCommentOwner - CommentRepositoryPostgres.test'
      })

      await expect(
        new CommentRepositoryPostgres(pool, {}).verifyCommentOwner({
          id: 'comment-123',
          owner: 'user-456'
        })
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when comment is owned by user', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title:
          'Thread title at verifyCommentOwner - CommentRepositoryPostgres.test'
      })
      await CommentsTableTestHelper.createComment({
        content:
          'Comment content at verifyCommentOwner - CommentRepositoryPostgres.test'
      })

      await expect(
        new CommentRepositoryPostgres(pool, {}).verifyCommentOwner({
          id: 'comment-123',
          owner: 'user-123'
        })
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })
})
