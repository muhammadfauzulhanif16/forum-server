const routes = (handler) => [
  {
    method: 'post',
    path: '/threads',
    handler: handler.createThread,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'get',
    path: '/threads/{threadId}',
    handler: handler.getThread
  }
]

module.exports = routes
