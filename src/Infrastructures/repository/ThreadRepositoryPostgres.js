const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CreatedThreadEntity = require('../../Domains/threads/entities/CreatedThreadEntity')
const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const ThreadDetailsEntity = require('../../Domains/threads/entities/ThreadDetailsEntity')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor (pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async createThread (payload) {
    const { title, body, owner } = payload

    const id = `thread-${this._idGenerator()}`
    const result = await this._pool.query({
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner]
    })

    return result.rows.map((row) => new CreatedThreadEntity(row))[0]
  }

  async getThread (id) {
    const result = await this._pool.query({
      text: 'SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username FROM threads LEFT JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id]
    })

    return result.rows.map((row) => new ThreadDetailsEntity(row))[0]
  }

  async verifyAvailableThread (id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    })

    if (!result.rowCount) {
      throw new NotFoundError('Thread not found')
    }
  }
}

module.exports = ThreadRepositoryPostgres
