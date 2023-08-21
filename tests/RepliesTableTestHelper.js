const pool = require('../src/Infrastructures/database/postgres/pool')
const ReplyDetailsEntity = require('../src/Domains/replies/entities/ReplyDetailsEntity')
const CreatedReplyEntity = require('../src/Domains/replies/entities/CreatedReplyEntity')

const RepliesTableTestHelper = {
  async createReply ({
    id = 'reply-123',
    content = 'Reply content',
    owner = 'user-123',
    commentId = 'comment-123',
    isDelete = false,
    date = new Date()
  }) {
    const result = await pool.query({
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, commentId, isDelete, date]
    })

    return result.rows.map((row) => new CreatedReplyEntity(row))[0]
  },
  async getReply (id) {
    const result = await pool.query({
      text: 'SELECT replies.id, replies.content, replies.created_at AS date, replies.is_deleted,users.username FROM replies INNER JOIN users ON replies.owner = users.id WHERE replies.id = $1',
      values: [id]
    })

    return result.rows.map((row) => new ReplyDetailsEntity(row))[0]
  },
  async cleanTable () {
    await pool.query('DELETE FROM replies WHERE 1=1')
  },
  async verifyAvailableReply (id) {
    const result = await pool.query({
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    })

    return result.rows
  }
}

module.exports = RepliesTableTestHelper
