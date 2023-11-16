/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    date = new Date(),
    content = 'test comment',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5)',
      values: [id, threadId, owner, content, date],
    };

    await pool.query(query);
  },
  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    };

    const { rows } = await pool.query(query);

    return rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
