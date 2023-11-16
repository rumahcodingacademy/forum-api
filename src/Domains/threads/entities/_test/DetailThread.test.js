const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-x123',
    };

    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      id: 'thread-x213',
      title: 123,
      body: true,
      date: 212321,
      username: true,
    };

    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create getThreadById object correctly', () => {
    const payload = {
      id: 'thread-x213',
      title: 'some thread',
      body: 'black',
      date: new Date(),
      username: 'pGamer',
    };

    const {
      id, title, body, date, username,
    } = new DetailThread(payload);

    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
