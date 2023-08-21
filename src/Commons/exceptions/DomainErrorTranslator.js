const InvariantError = require('./InvariantError')

const DomainErrorTranslator = {
  translate (error) {
    return DomainErrorTranslator._directories[error.message] || error
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),

  'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),

  'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),

  'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),
  'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    "Required property doesn't exist"
  ),

  'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),

  'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),

  'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  ),
  'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    "Data type doesn't match"
  )
}
module.exports = DomainErrorTranslator
