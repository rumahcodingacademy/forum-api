class GetThreadByIdUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeUnlikeRepository = likeRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    let comments = await this._commentRepository.getCommentsByThreadId(id);
    const replies = await this._replyRepository.getRepliesByThreadId(id);
    const likesCount = await this._likeUnlikeRepository.getLikeCountComment(id);

    comments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted
        ? '**komentar telah dihapus**'
        : comment.content,
      likeCount: likesCount.filter(
        (like) => like.comment_id === comment.id,
      ).length,
      replies: replies.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_deleted
            ? '**balasan telah dihapus**'
            : reply.content,
          date: reply.date,
          username: reply.username,
        })),
    }));

    return { ...thread, comments };
  }
}

module.exports = GetThreadByIdUseCase;
