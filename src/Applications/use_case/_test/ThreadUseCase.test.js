const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const ThreadUseCase = require('../ThreadUseCase')
const CreatedThreadEntity = require('../../../Domains/threads/entities/CreatedThreadEntity')
const CreateThreadEntity = require('../../../Domains/threads/entities/CreateThreadEntity')

describe('ThreadUseCase', () => {
  const mockThreadRepository = new ThreadRepository()
  const mockCommentRepository = new CommentRepository()
  const mockReplyRepository = new ReplyRepository()

  const threadUseCase = new ThreadUseCase({
    threadRepository: mockThreadRepository,
    commentRepository: mockCommentRepository,
    replyRepository: mockReplyRepository
  })

  it('should orchestrating createThread action correctly', async () => {
    mockThreadRepository.createThread = jest.fn(() =>
      Promise.resolve(
        new CreatedThreadEntity({
          id: 'thread-123',
          title: 'Thread Title at createThread - ThreadUseCase.test',
          owner: 'user-123'
        })
      )
    )

    const result = await threadUseCase.createThread({
      title: 'Thread Title at createThread - ThreadUseCase.test',
      body: 'Thread Body',
      owner: 'user-123'
    })

    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThreadEntity({
        title: 'Thread Title at createThread - ThreadUseCase.test',
        body: 'Thread Body',
        owner: 'user-123'
      })
    )
    expect(result).toStrictEqual(
      new CreatedThreadEntity({
        id: 'thread-123',
        title: 'Thread Title at createThread - ThreadUseCase.test',
        owner: 'user-123'
      })
    )
  })

  it('should orchestrating getThread action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockThreadRepository.getThread = jest.fn(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'Thread Title at getThread - getThread',
        body: 'Thread Body',
        date: new Date(),
        username: 'fauzul'
      })
    )
    mockCommentRepository.getCommentsByThread = jest.fn(() =>
      Promise.resolve([
        {
          id: 'comment-123',
          content: '**komentar telah dihapus**',
          date: new Date(),
          username: 'fauzul'
        }
      ])
    )
    mockReplyRepository.getRepliesByComment = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          content: '**balasan telah dihapus**',
          date: new Date(),
          username: 'fauzul'
        }
      ])
    )
    mockCommentRepository.getLikesByComment = jest.fn(() =>
      Promise.resolve([
        {
          comment_id: 'comment-123',
          user_id: 'user-123'
        }
      ])
    )

    const result = await threadUseCase.getThread('thread-123')
    console.log(result)

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockThreadRepository.getThread).toBeCalledWith('thread-123')
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockReplyRepository.getRepliesByComment).toBeCalledWith([
      'comment-123'
    ])
    expect(mockCommentRepository.getLikesByComment).toBeCalledWith([
      'comment-123'
    ])

    expect(result).toStrictEqual({
      id: 'thread-123',
      title: 'Thread Title at getThread - getThread',
      body: 'Thread Body',
      date: expect.any(Date),
      username: 'fauzul',
      comments: [
        {
          id: 'comment-123',
          content: '**komentar telah dihapus**',
          date: expect.any(Date),
          username: 'fauzul',
          likeCount: 1,
          replies: []
        }
      ]
    })
  })
})
