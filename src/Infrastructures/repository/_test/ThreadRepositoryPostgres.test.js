const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const pool = require('../../database/postgres/pool')
const CreateThreadEntity = require('../../../Domains/threads/entities/CreateThreadEntity')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('createThread function', () => {
    it('should create and have created correct thread and have length of 1', async () => {
      await UsersTableTestHelper.addUser({})

      const result = await new ThreadRepositoryPostgres(
        pool,
        () => '123'
      ).createThread(
        new CreateThreadEntity({
          title: 'Thread title at createThread - ThreadRepositoryPostgres.test',
          body: 'Thread body',
          owner: 'user-123'
        })
      )

      expect({ ...result }).toStrictEqual({
        id: 'thread-123',
        title: 'Thread title at createThread - ThreadRepositoryPostgres.test',
        owner: 'user-123'
      })
      expect(await ThreadsTableTestHelper.getThread(result.id)).toHaveLength(1)
    })
  })

  describe('getThread function', () => {
    it('should return details when the thread is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({
        title: 'Thread title at getThread - ThreadRepositoryPostgres.test'
      })

      const result = await new ThreadRepositoryPostgres(pool, {}).getThread(
        'thread-123'
      )

      expect({ ...result }).toStrictEqual({
        id: 'thread-123',
        title: 'Thread title at getThread - ThreadRepositoryPostgres.test',
        body: 'Thread body',
        date: expect.any(Date),
        username: 'fauzul'
      })
    })
  })

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      await expect(
        new ThreadRepositoryPostgres(pool, {}).verifyAvailableThread(
          'thread-123'
        )
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when thread is found', async () => {
      await UsersTableTestHelper.addUser({})
      await ThreadsTableTestHelper.createThread({})

      await expect(
        new ThreadRepositoryPostgres(pool, {}).verifyAvailableThread(
          'thread-123'
        )
      ).resolves.not.toThrowError(NotFoundError)
    })
  })
})
