const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe('addComment function', () => {
    it(
      'should persist new comment and return added comment correctly',
      async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});

        const newComment = new AddComment({
          content: 'test content',
          threadId: 'thread-123',
          owner: 'user-123',
        });
        const fakeIdGenerator = () => '123';
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

        const addedComment = await commentRepositoryPostgres
          .addComment(newComment);

        const comment = await CommentsTableTestHelper
          .findCommentById('comment-123');

        expect(comment).toHaveLength(1);
        expect(addedComment).toStrictEqual(new AddedComment({
          id: 'comment-123',
          content: 'test content',
          owner: 'user-123',
        }));
      },
    );
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when owner is not the same as the payload', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres
          .verifyCommentOwner('comment-123', 'user-1234'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it(
      'should return nothing when owner is the same as the payload',
      async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        await expect(commentRepositoryPostgres
          .verifyCommentOwner('comment-123', 'user-123'))
          .resolves.not.toThrowError(AuthorizationError);
      },
    );
  });

  describe('deleteCommentById function', () => {
    it(
      'should return NotFoundError when comment is not available',
      async () => {
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        await expect(commentRepositoryPostgres.deleteCommentById('123'))
          .rejects.toThrowError(NotFoundError);
      },
    );

    it('should delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.deleteCommentById('comment-123'))
        .resolves.not.toThrowError(NotFoundError);

      const deletedComment = await CommentsTableTestHelper
        .findCommentById('comment-123');

      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return an empty array when thread has no comments', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres
        .getCommentsByThreadId('thread-123');

      expect(result).toStrictEqual([]);
    });

    it('should return all the thread comments correctly', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const firstComment = {
        id: 'comment-123',
        date: new Date('2023-10-07T11:00:00.000Z'),
        content: 'first',
        is_deleted: false,
      };
      const secondComment = {
        id: 'comment-124',
        date: new Date('2023-10-07T12:00:00.000Z'),
        content: 'second',
        is_deleted: false,
      };

      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres
        .getCommentsByThreadId('thread-123');

      expect(result).toStrictEqual([
        { ...firstComment, username: 'dicoding' },
        { ...secondComment, username: 'dicoding' },
      ]);
    });
  });

  describe('verifyAvailableCommentInThread function', () => {
    it('should return NotFoundError when thread is unavailable', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres
          .verifyAvailableCommentInThread('comment-123', 'thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return NotFoundError when comment is unavailabe', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-124' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-124',
      });
      await CommentsTableTestHelper.addComment({ id: 'comment-124' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await expect(
        commentRepositoryPostgres
          .verifyAvailableCommentInThread('comment-123', 'thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it(
      'should return nothing when thread and comment are available',
      async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});

        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

        await expect(commentRepositoryPostgres.verifyAvailableCommentInThread(
          'comment-123',
          'thread-123',
        )).resolves.not.toThrowError(NotFoundError);
      },
    );
  });
});
