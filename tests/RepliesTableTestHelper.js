/* instanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    owner = 'user-123',
    content = 'test content',
    date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1,$2,$3,$4,$5)',
      values: [id, commentId, owner, content, date],
    };

    await pool.query(query);
  },
  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id=$1',
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },
  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
