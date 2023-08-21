class CreateReplyEntity {
  constructor (payload) {
    const { content, commentId, threadId, owner } = payload

    this.content = content
    this.commentId = commentId
    this.threadId = threadId
    this.owner = owner

    this._verifyPayload(payload)
  }

  _verifyPayload (payload) {
    const { content, commentId, threadId, owner } = payload

    if (!content || !commentId || !threadId || !owner) {
      throw new Error('CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof content !== 'string' ||
      typeof commentId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = CreateReplyEntity
