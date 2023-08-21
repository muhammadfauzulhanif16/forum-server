const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CreatedCommentEntity = require('../../Domains/comments/entities/CreatedCommentEntity')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const CommentDetailsEntity = require('../../Domains/comments/entities/CommentDetailsEntity')

class CommentRepositoryPostgres extends CommentRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async createComment (payload) {
    const { content, owner, threadId } = payload

    const id = `comment-${this._idGenerator()}`
    const result = await this._pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, threadId]
    })

    return result.rows.map((row) => new CreatedCommentEntity(row))[0]
  }

  async createLike (payload) {
    const { commentId, owner } = payload

    await this._pool.query({
      text: 'INSERT INTO like_comments VALUES($1, $2)',
      values: [commentId, owner]
    })
  }

  async getCommentsByThread (threadId) {
    const result = await this._pool.query({
      text: 'SELECT comments.id, comments.content, comments.created_at AS date, comments.is_deleted, users.username FROM comments INNER JOIN users ON comments.owner = users.id WHERE comments.thread_id = $1 ORDER BY comments.created_at',
      values: [threadId]
    })

    return result.rows.map((row) => new CommentDetailsEntity(row))
  }

  async getLikesByComment (ids) {
    const result = await this._pool.query({
      text: 'SELECT * FROM like_comments WHERE comment_id = ANY($1::text[])',
      values: [ids]
    })

    return result.rows
  }

  async deleteComment (id) {
    await this._pool.query({
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id]
    })
  }

  async deleteLike (payload) {
    const { commentId, owner } = payload

    await this._pool.query({
      text: 'DELETE FROM like_comments WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    })
  }

  async verifyAvailableComment (id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    })

    if (!result.rowCount) {
      throw new NotFoundError('Comment not found')
    }
  }

  async verifyAvailableLike (payload) {
    const { commentId, owner } = payload

    const result = await this._pool.query({
      text: 'SELECT * FROM like_comments WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner]
    })

    return Boolean(result.rowCount)
  }

  async verifyCommentOwner (payload) {
    const { id, owner } = payload

    const result = await this._pool.query({
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner]
    })

    if (!result.rowCount) {
      throw new AuthorizationError('Unauthorized')
    }
  }
}

module.exports = CommentRepositoryPostgres
