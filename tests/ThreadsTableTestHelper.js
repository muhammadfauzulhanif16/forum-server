/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async createThread ({
    id = 'thread-123',
    title = 'Thread title',
    body = 'Thread body',
    date = new Date(),
    owner = 'user-123'
  }) {
    await pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date]
    })
  },
  async getThread (id) {
    const result = await pool.query({
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id]
    })

    return result.rows
  },
  async cleanTable () {
    await pool.query('DELETE FROM threads WHERE 1=1')
  }
}

module.exports = ThreadsTableTestHelper
