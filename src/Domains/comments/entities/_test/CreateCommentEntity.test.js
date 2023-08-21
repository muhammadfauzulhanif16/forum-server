const CreateCommentEntity = require('../CreateCommentEntity')

describe('CreateCommentEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CreateCommentEntity({
          content: 'Thread title at CreateCommentEntity.test',
          owner: 'user-123'
        })
    ).toThrowError('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet meet data type specification', () => {
    expect(
      () =>
        new CreateCommentEntity({
          content: 'Thread Title at CreateCommentEntity.test',
          threadId: 'thread-123',
          owner: 123
        })
    ).toThrowError('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create comment object correctly', () => {
    const result = new CreateCommentEntity({
      content: 'Thread title at CreateCommentEntity.test',
      threadId: 'thread-123',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      content: 'Thread title at CreateCommentEntity.test',
      threadId: 'thread-123',
      owner: 'user-123'
    })
  })
})
