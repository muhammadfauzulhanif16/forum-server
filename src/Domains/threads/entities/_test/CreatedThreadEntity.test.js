const CreatedThreadEntity = require('../CreatedThreadEntity')

describe('CreatedThreadEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CreatedThreadEntity({
          id: 'thread-123',
          owner: 'user-123'
        })
    ).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CreatedThreadEntity({
          id: 123,
          title: 'Thread title at CreatedThreadEntity.test',
          owner: 'user-123'
        })
    ).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should created thread object correctly', () => {
    const result = new CreatedThreadEntity({
      id: 'thread-123',
      title: 'Thread title at CreatedThreadEntity.test',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      id: 'thread-123',
      title: 'Thread title at CreatedThreadEntity.test',
      owner: 'user-123'
    })
  })
})
