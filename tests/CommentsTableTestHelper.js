const pool = require('../src/Infrastructures/database/postgres/pool')
const CommentDetailsEntity = require('../src/Domains/comments/entities/CommentDetailsEntity')
const CreatedCommentEntity = require('../src/Domains/comments/entities/CreatedCommentEntity')

const CommentsTableTestHelper = {
  async createComment ({
    id = 'comment-123',
    content = 'Comment content',
    owner = 'user-123',
    threadId = 'thread-123',
    isDeleted = false,
    date = new Date()
  }) {
    const result = await pool.query({
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, isDeleted, date]
    })

    return result.rows.map((row) => new CreatedCommentEntity(row))[0]
  },
  async createLike ({ commentId = 'comment-123', owner = 'user-123' }) {
    await pool.query({
      text: 'INSERT INTO like_comments VALUES($1, $2)',
      values: [commentId, owner]
    })
  },
  async getComment (id) {
    const result = await pool.query({
      text: 'SELECT comments.id, comments.content, comments.created_at as date, comments.is_deleted,users.username FROM comments INNER JOIN users ON comments.owner = users.id WHERE comments.id = $1',
      values: [id]
    })

    return result.rows.map((row) => new CommentDetailsEntity(row))[0]
  },
  async getLikesByComment (ids) {
    const result = await pool.query({
      text: 'SELECT * FROM like_comments WHERE comment_id = ANY($1::text[])',
      values: [ids]
    })

    return result.rows
  },
  async cleanTable () {
    await pool.query('DELETE FROM comments WHERE 1=1')
  },
  async verifyAvailableComment (id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id]
    })

    return result.rows
  }
}

module.exports = CommentsTableTestHelper
