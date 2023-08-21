const ThreadRepository = require('../ThreadRepository')

describe('ThreadRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const threadRepository = new ThreadRepository()

    await expect(threadRepository.createThread).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(threadRepository.getThread).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(threadRepository.verifyAvailableThread).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
  })
})
