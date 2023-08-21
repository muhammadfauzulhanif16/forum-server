const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const CommentUseCase = require('../CommentUseCase')
const CreatedCommentEntity = require('../../../Domains/comments/entities/CreatedCommentEntity')

describe('CommentUseCase', () => {
  const mockThreadRepository = new ThreadRepository()
  const mockCommentRepository = new CommentRepository()

  const commentUseCase = new CommentUseCase({
    threadRepository: mockThreadRepository,
    commentRepository: mockCommentRepository
  })

  it('should orchestrating createComment action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.createComment = jest.fn(() =>
      Promise.resolve(
        new CreatedCommentEntity({
          id: 'comment-123',
          content: 'Content Comment',
          owner: 'user-123'
        })
      )
    )

    const result = await commentUseCase.createComment({
      threadId: 'thread-123',
      content: 'Comment Content',
      owner: 'user-123'
    })

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.createComment).toBeCalledWith({
      threadId: 'thread-123',
      content: 'Comment Content',
      owner: 'user-123'
    })
    expect(result).toStrictEqual(
      new CreatedCommentEntity({
        id: 'comment-123',
        content: 'Content Comment',
        owner: 'user-123'
      })
    )
  })

  it('should orchestrating createComment action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableLike = jest.fn(() => Promise.resolve())
    mockCommentRepository.deleteLike = jest.fn(() => Promise.resolve())
    mockCommentRepository.createLike = jest.fn(() => Promise.resolve())

    await commentUseCase.updateLike({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    })

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      'comment-123'
    )
    expect(mockCommentRepository.verifyAvailableLike).toBeCalledWith({
      commentId: 'comment-123',
      owner: 'user-123'
    })

    const verifyAvailableLike = false
    if (!verifyAvailableLike) {
      await mockCommentRepository.createLike({
        commentId: 'comment-123',
        owner: 'user-123'
      })
    }

    expect(mockCommentRepository.createLike).toHaveBeenCalledWith({
      commentId: 'comment-123',
      owner: 'user-123'
    })
    expect(mockCommentRepository.deleteLike).not.toHaveBeenCalled()
  })

  it('should orchestrating deleteComment action correctly', async () => {
    mockThreadRepository.verifyAvailableThread = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve())

    await commentUseCase.deleteComment({
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123'
    })

    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      'thread-123'
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      'comment-123'
    )
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith({
      id: 'comment-123',
      owner: 'user-123'
    })
    expect(mockCommentRepository.deleteComment).toBeCalledWith('comment-123')
  })
})
