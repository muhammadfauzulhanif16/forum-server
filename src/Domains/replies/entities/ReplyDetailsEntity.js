class ReplyDetailsEntity {
  constructor (payload) {
    const { id, content, date, is_deleted: isDeleted, username } = payload

    this.id = id
    this.content = isDeleted ? '**balasan telah dihapus**' : content
    this.date = date
    this.username = username

    this._verifyPayload(payload)
  }

  _verifyPayload (payload) {
    const { id, content, date, is_deleted: isDeleted, username } = payload

    if (!id || !content || !date || !username) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof isDeleted !== 'boolean' ||
      typeof username !== 'string'
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = ReplyDetailsEntity
