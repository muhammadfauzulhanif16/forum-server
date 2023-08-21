const routes = (handler) => [
  {
    method: 'post',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.createReply,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'delete',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: handler.deleteReply,
    options: {
      auth: 'forum_jwt'
    }
  }
]

module.exports = routes
