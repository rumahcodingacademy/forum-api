const routes = require('./routes');
const LikesHandler = require('./handler');

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);
    server.route(routes(likesHandler));
  },
};
