const AddedComment = require('../AddedComment');

describe('an AddedComment entitites', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-123kj',
      content: 'x',
    };

    expect(() => new AddedComment(payload))
      .toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      id: {},
      content: 'x',
      owner: 1,
    };

    expect(() => new AddedComment(payload))
      .toThrowError(
        'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
  });

  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'comment-21x',
      content: 'x',
      owner: 'user-21321',
    };

    const { id, content, owner } = new AddedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
