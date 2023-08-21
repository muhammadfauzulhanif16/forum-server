const CreatedCommentEntity = require('../CreatedCommentEntity')

describe('CreatedCommentEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CreatedCommentEntity({
          id: 'comment-123',
          content: 'Comment content at CreatedCommentEntity.test'
        })
    ).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CreatedCommentEntity({
          id: 123,
          content: 'Comment content at CreatedCommentEntity.test',
          owner: 'user-123'
        })
    ).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should created comment object correctly ', () => {
    const result = new CreatedCommentEntity({
      id: 'comment-123',
      content: 'Comment content at CreatedCommentEntity.test',
      owner: 'user-123'
    })

    expect({ ...result }).toStrictEqual({
      id: 'comment-123',
      content: 'Comment content at CreatedCommentEntity.test',
      owner: 'user-123'
    })
  })
})
