const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(payload) {
    const useCasePayload = new DeleteReply(payload);
    await this._replyRepository.verifyAvailableReply(useCasePayload);
    await this._replyRepository.verifyReplyOwner(useCasePayload);
    await this._replyRepository.deleteReplyById(useCasePayload.replyId);
  }
}

module.exports = DeleteReplyUseCase;
