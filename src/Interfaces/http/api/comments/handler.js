const autoBind = require('auto-bind');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;
    const payload = {
      content,
      threadId,
      owner: request.auth.credentials.id,
    };

    const addCommentUseCase = this._container
      .getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(payload);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }

  async deleteCommentByIdHandler(request) {
    const { threadId, commentId } = request.params;
    const payload = {
      commentId,
      threadId,
      userId: request.auth.credentials.id,
    };

    const deleteCommentUseCase = this._container
      .getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
