const routes = (handler) => [
  {
    method: 'post',
    path: '/threads/{threadId}/comments',
    handler: handler.createComment,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'put',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.updateLike,
    options: {
      auth: 'forum_jwt'
    }
  },
  {
    method: 'delete',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteComment,
    options: {
      auth: 'forum_jwt'
    }
  }
]

module.exports = routes
