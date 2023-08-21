class ReplyRepository {
  async createReply (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByComment (commentIds) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async deleteReply (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableReply (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyReplyOwner (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = ReplyRepository
