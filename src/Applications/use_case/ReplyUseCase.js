const CreateReplyEntity = require('../../Domains/replies/entities/CreateReplyEntity')

class ReplyUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async createReply (payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId)
    await this._commentRepository.verifyAvailableComment(payload.commentId)
    const reply = new CreateReplyEntity(payload)

    return await this._replyRepository.createReply(reply)
  }

  async deleteReply (payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId)
    await this._commentRepository.verifyAvailableComment(payload.commentId)
    await this._replyRepository.verifyAvailableReply(payload.replyId)
    await this._replyRepository.verifyReplyOwner({
      id: payload.replyId,
      owner: payload.owner
    })
    await this._replyRepository.deleteReply(payload.replyId)
  }
}

module.exports = ReplyUseCase
