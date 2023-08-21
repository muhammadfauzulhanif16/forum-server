const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyUseCase = require('../ReplyUseCase')
const CreateReplyEntity = require('../../../Domains/replies/entities/CreateReplyEntity')
const CreatedReplyEntity = require('../../../Domains/replies/entities/CreatedReplyEntity')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')

describe('ReplyUseCase', () => {
  const mockThreadRepository = new ThreadRepository()
  const mockCommentRepository = new CommentRepository()
  const mockReplyRepository = new ReplyRepository()

  const replyUseCase = new ReplyUseCase({
    threadRepository: mockThreadRepository,
    commentRepository: mockCommentRepository,
    replyRepository: mockReplyRepository
  })

  it('should orchestrating createReply action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockReplyRepository.createReply = jest.fn(() =>
      Promise.resolve(
        new CreatedReplyEntity({
          id: 'reply-123',
          content: 'Reply Content',
          owner: 'user-123'
        })
      )
    )

    const result = await replyUseCase.createReply({
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'Reply Content',
      owner: 'user-123'
    })

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      'comment-123'
    )
    expect(mockReplyRepository.createReply).toBeCalledWith(
      new CreateReplyEntity({
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: 'Reply Content',
        owner: 'user-123'
      })
    )
    expect(result).toStrictEqual(
      new CreatedReplyEntity({
        id: 'reply-123',
        content: 'Reply Content',
        owner: 'user-123'
      })
    )
  })

  it('should orchestrating deleteReply action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockReplyRepository.verifyAvailableReply = jest.fn(() => Promise.resolve())
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve())
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve())

    await replyUseCase.deleteReply({
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123'
    })

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      'comment-123'
    )
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith('reply-123')
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith({
      id: 'reply-123',
      owner: 'user-123'
    })
    expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123')
  })
})
