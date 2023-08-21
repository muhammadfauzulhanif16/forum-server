const ReplyRepository = require('../ReplyRepository')

describe('ReplyRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const replyRepository = new ReplyRepository()

    await expect(replyRepository.createReply).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.getRepliesByComment).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.deleteReply).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.verifyAvailableReply).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
    await expect(replyRepository.verifyReplyOwner).rejects.toThrowError(
      'METHOD_NOT_IMPLEMENTED'
    )
  })
})
