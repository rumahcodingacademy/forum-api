const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const newReply = new AddReply(payload);
    await this._threadRepository.verifyAvailableThread(newReply.threadId);
    await this._commentRepository
      .verifyAvailableCommentInThread(newReply.commentId, newReply.threadId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
