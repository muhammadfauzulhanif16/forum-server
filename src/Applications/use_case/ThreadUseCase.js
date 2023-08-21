const CreateThreadEntity = require('../../Domains/threads/entities/CreateThreadEntity')
const ReplyDetailsEntity = require('../../Domains/replies/entities/ReplyDetailsEntity')

class ThreadUseCase {
  constructor ({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
  }

  async createThread (payload) {
    const thread = new CreateThreadEntity(payload)

    return await this._threadRepository.createThread(thread)
  }

  async getThread (id) {
    await this._threadRepository.verifyAvailableThread(id)
    const thread = await this._threadRepository.getThread(id)
    const comments = await this._commentRepository.getCommentsByThread(id)
    const replies = await this._replyRepository.getRepliesByComment(
      comments.map((comment) => comment.id)
    )
    const likes = await this._commentRepository.getLikesByComment(
      comments.map((comment) => comment.id)
    )

    return {
      ...thread,
      comments: comments.map((comment) => ({
        ...comment,
        likeCount: likes?.filter((like) => like.comment_id === comment.id)
          .length,
        replies: replies
          .filter((reply) => reply.comment_id === comment.id)
          .map(
            ({ comment_id: commentId, ...reply }) =>
              new ReplyDetailsEntity({ ...reply })
          )
      }))
    }
  }
}

module.exports = ThreadUseCase
