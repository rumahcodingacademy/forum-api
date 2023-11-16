const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenetator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenetator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const currDate = new Date();
    const query = {
      text: 'INSERT INTO threads VALUES($1,$2,$3,$4,$5) RETURNING id, title, owner',
      values: [id, title, body, owner, currDate],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async verifyAvailableThread(id) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `
        SELECT
        th.id,
        th.title,
        th.body,
        th.date,
        us.username
        FROM threads AS th
        JOIN users AS us ON us.id = th.owner
        WHERE th.id = $1
      `,
      values: [id],
    };

    const { rows, rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new DetailThread(rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
