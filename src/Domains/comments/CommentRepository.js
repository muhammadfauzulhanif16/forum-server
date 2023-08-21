class CommentRepository {
  async createComment (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async createLike (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async getCommentsByThread (threadId) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async getLikesByComment (ids) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async deleteComment (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async deleteLike (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableComment (id) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableLike (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }

  async verifyCommentOwner (payload) {
    throw new Error('METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = CommentRepository
