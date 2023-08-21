const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase')

class CommentsHandler {
  constructor (container) {
    this._container = container

    this.createComment = this.createComment.bind(this)
    this.updateLike = this.updateLike.bind(this)
    this.deleteComment = this.deleteComment.bind(this)
  }

  async createComment (request, h) {
    const addedComment = await this._container
      .getInstance(CommentUseCase.name)
      .createComment({
        owner: request.auth.credentials.userId,
        threadId: request.params.threadId,
        content: request.payload.content
      })

    return h
      .response({
        status: 'success',
        data: {
          addedComment
        }
      })
      .code(201)
  }

  async updateLike (request, h) {
    await this._container.getInstance(CommentUseCase.name).updateLike({
      owner: request.auth.credentials.userId,
      ...request.params
    })

    return h.response({
      status: 'success'
    })
  }

  async deleteComment (request, h) {
    await this._container.getInstance(CommentUseCase.name).deleteComment({
      owner: request.auth.credentials.userId,
      ...request.params
    })

    return h.response({
      status: 'success'
    })
  }
}

module.exports = CommentsHandler
