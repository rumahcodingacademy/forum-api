const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddComment(payload))
      .toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      content: 1,
      threadId: 'thread-123',
      owner: 'user-123',
    };

    expect(() => new AddComment(payload))
      .toThrowError(
        'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
  });

  it('should create addComment object correctly', () => {
    const payload = {
      content: 'this content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const { content, threadId, owner } = new AddComment(payload);

    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
  });
});
