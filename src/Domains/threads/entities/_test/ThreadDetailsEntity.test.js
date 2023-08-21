const ThreadDetailsEntity = require('../ThreadDetailsEntity')

describe('ThreadDetailsEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new ThreadDetailsEntity({
          id: 'thread-123',
          title: 'Thread title at ThreadDetailsEntity.test',
          body: 'Thread body',
          date: new Date()
        })
    ).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new ThreadDetailsEntity({
          id: 123,
          title: 'Thread title at ThreadDetailsEntity.test',
          body: 'Thread body',
          date: new Date(),
          username: 'fauzul'
        })
    ).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create thread details object correctly', () => {
    const result = new ThreadDetailsEntity({
      id: 'thread-123',
      title: 'Thread title at ThreadDetailsEntity.test',
      body: 'Thread body',
      date: new Date(),
      username: 'fauzul'
    })

    expect({ ...result }).toStrictEqual({
      id: 'thread-123',
      title: 'Thread title at ThreadDetailsEntity.test',
      body: 'Thread body',
      date: expect.any(Date),
      username: 'fauzul'
    })
  })
})
