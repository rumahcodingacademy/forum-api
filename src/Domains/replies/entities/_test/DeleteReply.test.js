const DeleteReply = require('../DeleteReply');

describe('an DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DeleteReply(payload))
      .toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      replyId: 1,
      commentId: 'comment-123',
      threadId: true,
      userId: 'user-123',
    };

    expect(() => new DeleteReply(payload))
      .toThrowError(
        'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
  });

  it('should create DeleteReply object correctly', () => {
    const payload = {
      replyId: 'reply-1',
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
    };

    const deleteReply = new DeleteReply(payload);

    expect(deleteReply.replyId).toEqual(payload.replyId);
    expect(deleteReply.commentId).toEqual(payload.commentId);
    expect(deleteReply.threadId).toEqual(payload.threadId);
    expect(deleteReply.userId).toEqual(payload.userId);
  });
});
