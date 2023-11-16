const autoBind = require('auto-bind');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async postThreadHandler(request, h) {
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addThreadUseCase = this._container
      .getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }

  async getThreadByIdHandler(request) {
    const getThreadByIdUseCase = this._container
      .getInstance(GetThreadByIdUseCase.name);
    const thread = await getThreadByIdUseCase.execute(request.params.id);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
