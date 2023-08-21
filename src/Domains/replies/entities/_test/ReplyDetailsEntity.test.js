const ReplyDetailsEntity = require('../ReplyDetailsEntity')

describe('ReplyDetailsEntity', () => {
  it('should throw error when payload did not contain needed property ', () => {
    expect(
      () =>
        new ReplyDetailsEntity({
          id: 'reply-123',
          content: 'Reply content at ReplyDetailsEntity.test',
          is_deleted: false,
          username: 'fauzul'
        })
    ).toThrowError('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
  })

  it('should throw error when payload did not meet data type specification', () => {
    expect(
      () =>
        new ReplyDetailsEntity({
          id: 123,
          content: 'Reply content at ReplyDetailsEntity.test',
          date: new Date(),
          is_deleted: false,
          username: 'fauzul'
        })
    ).toThrowError('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })

  it('should create reply details object correctly when content is available', () => {
    const result = new ReplyDetailsEntity({
      id: 'reply-123',
      content: 'Reply content at ReplyDetailsEntity.test',
      date: new Date(),
      is_deleted: false,
      username: 'fauzul'
    })

    expect({ ...result }).toStrictEqual({
      id: 'reply-123',
      content: 'Reply content at ReplyDetailsEntity.test',
      date: expect.any(Date),
      username: 'fauzul'
    })
  })

  it('should create reply details object correctly when content is deleted', () => {
    const result = new ReplyDetailsEntity({
      id: 'reply-123',
      content: 'Reply content at ReplyDetailsEntity.test',
      date: new Date(),
      is_deleted: true,
      username: 'fauzul'
    })

    expect({ ...result }).toStrictEqual({
      id: 'reply-123',
      content: '**balasan telah dihapus**',
      date: expect.any(Date),
      username: 'fauzul'
    })
  })
})
