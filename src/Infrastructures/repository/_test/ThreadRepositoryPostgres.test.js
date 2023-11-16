const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addThread function', () => {
    it(
      'should persist new thread and return added thread correctly',
      async () => {
        await UsersTableTestHelper.addUser({});
        const newThread = new AddThread({
          title: 'test thread',
          body: 'body thread',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

        await threadRepositoryPostgres.addThread(newThread);

        const thread = await ThreadsTableTestHelper
          .findThreadById('thread-123');
        expect(thread).toHaveLength(1);
      },
    );

    it('should return added thread correctly', async () => {
      await UsersTableTestHelper.addUser({});
      const newThread = new AddThread({
        title: 'test thread',
        body: 'body thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'test thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await expect(threadRepositoryPostgres.verifyAvailableThread('1')).rejects
        .toThrowError(NotFoundError);
    });

    it('should return nothing when thread found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-1' });

      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await expect(threadRepositoryPostgres.getThreadById('1')).rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, '');

      await UsersTableTestHelper.addUser({});

      const currentDate = new Date();
      await ThreadsTableTestHelper.addThread(
        {
          id: 'thread-1',
          title: 'test thread',
          body: 'body thread',
          date: currentDate,
          owner: 'user-123',
        },
      );

      const thread = await threadRepositoryPostgres.getThreadById('thread-1');
      expect(thread).toStrictEqual(new DetailThread({
        id: 'thread-1',
        title: 'test thread',
        body: 'body thread',
        date: currentDate,
        username: 'dicoding',
      }));
    });
  });
});
