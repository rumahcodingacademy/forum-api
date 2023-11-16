const routes = (hander) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: hander.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: hander.deleteReplyByIdHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
];

module.exports = routes;
