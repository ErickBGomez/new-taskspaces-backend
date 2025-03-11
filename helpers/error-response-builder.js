import ResponseBuilder from './response-builder.js';

class ErrorResponseBuilder extends ResponseBuilder {
  constructor() {
    super();
  }

  setError(error = 'Response error') {
    this.response.error = error;
    return this;
  }
}

export default ErrorResponseBuilder;
