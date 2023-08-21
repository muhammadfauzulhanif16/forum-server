const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase')

class ReplyHandler {
  constructor (container) {
    this._container = container

    this.createReply = this.createReply.bind(this)
    this.deleteReply = this.deleteReply.bind(this)
  }

  async createReply (request, h) {
    const addedReply = await this._container
      .getInstance(ReplyUseCase.name)
      .createReply({
        owner: request.auth.credentials.userId,
        ...request.params,
        content: request.payload.content
      })

    return h
      .response({
        status: 'success',
        data: {
          addedReply
        }
      })
      .code(201)
  }

  async deleteReply (request, h) {
    await this._container.getInstance(ReplyUseCase.name).deleteReply({
      owner: request.auth.credentials.userId,
      ...request.params
    })

    return h.response({
      status: 'success'
    })
  }
}

module.exports = ReplyHandler
