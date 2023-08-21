const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase')

class ThreadsHandler {
  constructor (container) {
    this._container = container

    this.createThread = this.createThread.bind(this)
    this.getThread = this.getThread.bind(this)
  }

  async createThread (request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const addedThread = await threadUseCase.createThread({
      owner: request.auth.credentials.userId,
      ...request.payload
    })

    return h
      .response({
        status: 'success',
        data: {
          addedThread
        }
      })
      .code(201)
  }

  async getThread (request, h) {
    const threadUseCase = this._container.getInstance(ThreadUseCase.name)
    const thread = await threadUseCase.getThread(request.params.threadId)

    return h.response({
      status: 'success',
      data: {
        thread
      }
    })
  }
}

module.exports = ThreadsHandler
