const CommentDetailsEntity = require('../CommentDetailsEntity')

describe('CommentDetailsEntity', () => {
  it('should throw error when payload did not contain needed property', () => {
    expect(
      () =>
        new CommentDetailsEntity({
          id: 'comment-123',
          content: 'Comment content at CommentDetailsEntity.test',
          is_deleted: false,
          username: 'fauzul'
        })
    ).toThrowError('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new CommentDetailsEntity({
          id: 123,
          content: 'Comment content at CommentDetailsEntity.test',
          date: new Date(),
          is_deleted: false,
          username: 'fauzul'
        })
    ).toThrowError('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create comment details object correctly when content is available', () => {
    const result = new CommentDetailsEntity({
      id: 'comment-123',
      content: 'Comment content at CommentDetailsEntity.test',
      date: new Date(),
      is_deleted: false,
      username: 'fauzul'
    })

    expect({ ...result }).toStrictEqual({
      id: 'comment-123',
      content: 'Comment content at CommentDetailsEntity.test',
      date: expect.any(Date),
      username: 'fauzul'
    })
  })

  it('should create comment details object correctly when content is deleted', () => {
    const result = new CommentDetailsEntity({
      id: 'comment-123',
      content: 'Comment content at CommentDetailsEntity.test',
      date: new Date(),
      is_deleted: true,
      username: 'fauzul'
    })

    expect({ ...result }).toStrictEqual({
      id: 'comment-123',
      content: '**komentar telah dihapus**',
      date: expect.any(Date),
      username: 'fauzul'
    })
  })
})
