const AddReply = require('../AddReply');

describe('an AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddReply(payload))
      .toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      content: 1,
      commentId: 'comment-123',
      threadId: true,
      owner: 'user-123',
    };

    expect(() => new AddReply(payload))
      .toThrowError(
        'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
  });

  it('should create addReply object correctly', () => {
    const payload = {
      content: 'this content',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const addedAddReply = new AddReply(payload);

    expect(addedAddReply.content).toEqual(payload.content);
    expect(addedAddReply.commentId).toEqual(payload.commentId);
    expect(addedAddReply.threadId).toEqual(payload.threadId);
    expect(addedAddReply.owner).toEqual(payload.owner);
  });
});
