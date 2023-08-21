const ReplyRepository = require('../../Domains/replies/ReplyRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const CreatedReplyEntity = require('../../Domains/replies/entities/CreatedReplyEntity')
const ReplyDetailsEntity = require('../../Domains/replies/entities/ReplyDetailsEntity')

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async createReply (payload) {
    const { content, owner, commentId } = payload

    const id = `reply-${this._idGenerator()}`
    const result = await this._pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, owner, commentId]
    })

    return result.rows.map((row) => new CreatedReplyEntity(row))[0]
  }

  async getRepliesByComment (commentIds) {
    const result = await this._pool.query({
      text: 'SELECT replies.id, replies.content, replies.created_at AS date, replies.is_deleted, replies.comment_id, users.username FROM replies INNER JOIN users ON users.id = replies.owner WHERE replies.comment_id = ANY($1::text[]) ORDER BY replies.created_at',
      values: [commentIds]
    })

    return result.rows
  }

  async deleteReply (id) {
    await this._pool.query({
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id]
    })
  }

  async verifyReplyOwner (payload) {
    const { id, owner } = payload

    const result = await this._pool.query({
      text: 'SELECT owner FROM replies WHERE id = $1 AND owner = $2',
      values: [id, owner]
    })

    if (!result.rowCount) {
      throw new AuthorizationError('Unauthorized')
    }
  }

  async verifyAvailableReply (id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    })

    if (!result.rowCount) {
      throw new NotFoundError('Reply not found')
    }
  }
}

module.exports = ReplyRepositoryPostgres
