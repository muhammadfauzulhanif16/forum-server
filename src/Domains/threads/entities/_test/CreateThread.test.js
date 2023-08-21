const CreateThreadEntity = require('../CreateThreadEntity')

describe('CreateThreadEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CreateThreadEntity({
          title: 'Thread title at CreateThreadEntity.test',
          owner: 'user-123'
        })
    ).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CreateThreadEntity({
          title: 'Thread title at CreateThreadEntity.test',
          body: 'Thread body',
          owner: 123
        })
    ).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create thread object correctly', () => {
    const result = new CreateThreadEntity({
      title: 'Thread title at CreateThreadEntity.test',
      body: 'Thread body',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      title: 'Thread title at CreateThreadEntity.test',
      body: 'Thread body',
      owner: 'user-123'
    })
  })
})
