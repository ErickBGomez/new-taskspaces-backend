import ResponseBuilder from './response-builder.js';

class SuccessResponseBuilder extends ResponseBuilder {
  constructor() {
    super();
  }

  setContent(content = 'Response content') {
    this.response.content = content;
    return this;
  }
}

export default SuccessResponseBuilder;
