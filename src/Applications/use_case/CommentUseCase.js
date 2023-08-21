const CreateCommentEntity = require('../../Domains/comments/entities/CreateCommentEntity')

class CommentUseCase {
  constructor ({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async createComment (payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId)
    const comment = new CreateCommentEntity(payload)

    return await this._commentRepository.createComment(comment)
  }

  async updateLike (payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId)
    await this._commentRepository.verifyAvailableComment(payload.commentId)
    const verifyAvailableLike =
      await this._commentRepository.verifyAvailableLike({
        commentId: payload.commentId,
        owner: payload.owner
      })

    if (verifyAvailableLike) {
      await this._commentRepository.deleteLike({
        commentId: payload.commentId,
        owner: payload.owner
      })
    } else {
      await this._commentRepository.createLike({
        commentId: payload.commentId,
        owner: payload.owner
      })
    }
  }

  async deleteComment (payload) {
    await this._threadRepository.verifyAvailableThread(payload.threadId)
    await this._commentRepository.verifyAvailableComment(payload.commentId)
    await this._commentRepository.verifyCommentOwner({
      id: payload.commentId,
      owner: payload.owner
    })
    await this._commentRepository.deleteComment(payload.commentId)
  }
}

module.exports = CommentUseCase
