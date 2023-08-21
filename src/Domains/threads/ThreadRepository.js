class ThreadRepository {
  async createThread (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async getThread (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableThread (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ThreadRepository
