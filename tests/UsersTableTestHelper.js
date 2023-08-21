/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool')

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-123',
    username = 'fauzul',
    password = 'fauzul',
    fullname = 'Fauzul'
  }) {
    const result = await pool.query({
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, password',
      values: [id, username, password, fullname]
    })

    return result.rows[0]
  },
  async findUsersById (id) {
    const result = await pool.query({
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    })

    return result.rows
  },
  async cleanTable () {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}

module.exports = UsersTableTestHelper
