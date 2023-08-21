const CreatedReplyEntity = require('../CreatedReplyEntity')

describe('CreatedReplyEntity', () => {
  it('should throw error when payload did not contain needed property ', () => {
    expect(
      () =>
        new CreatedReplyEntity({
          id: 'reply-123',
          content: 'Reply content at CreatedReplyEntity.test'
        })
    ).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CreatedReplyEntity({
          id: 123,
          content: 'Reply content at CreatedReplyEntity.test',
          owner: 'user-123'
        })
    ).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should created thread object correctly', () => {
    const result = new CreatedReplyEntity({
      id: 'reply-123',
      content: 'Reply content at CreatedReplyEntity.test',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      id: 'reply-123',
      content: 'Reply content at CreatedReplyEntity.test',
      owner: 'user-123'
    })
  })
})
