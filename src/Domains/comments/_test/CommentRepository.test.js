const CommentRepository = require('../CommentRepository')

describe('CommentRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const commentRepository = new CommentRepository()

    await expect(commentRepository.createComment).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.createLike).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.getCommentsByThread).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.getLikesByComment).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.deleteComment).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.deleteLike).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.verifyAvailableComment).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.verifyAvailableLike).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(commentRepository.verifyCommentOwner).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
  })
})
