class DeleteReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      replyId, commentId, threadId, userId,
    } = payload;

    this.replyId = replyId;
    this.commentId = commentId;
    this.threadId = threadId;
    this.userId = userId;
  }

  _verifyPayload({
    replyId, commentId, threadId, userId,
  }) {
    if (!replyId || !commentId || !threadId || !userId) {
      throw new Error('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof replyId !== 'string'
          || typeof commentId !== 'string'
          || typeof threadId !== 'string'
          || typeof userId !== 'string') {
      throw new Error('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReply;
