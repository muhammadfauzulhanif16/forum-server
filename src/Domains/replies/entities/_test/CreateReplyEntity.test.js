const CreateReplyEntity = require('../CreateReplyEntity')

describe('CreateReplyEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CreateReplyEntity({
          commentId: 'comment-123',
          threadId: 'thread-123',
          owner: 'user-123'
        })
    ).toThrowError('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CreateReplyEntity({
          content: 'Reply content at CreateReplyEntity.test',
          commentId: 'comment-123',
          threadId: 'thread-123',
          owner: 123
        })
    ).toThrowError('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create reply object correctly', () => {
    const result = new CreateReplyEntity({
      content: 'Reply content at CreateReplyEntity.test',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      content: 'Reply content at CreateReplyEntity.test',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123'
    })
  })
})
