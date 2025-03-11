class ResponseBuilder {
  constructor() {
    this.response = {};
  }

  setStatus(status = 200) {
    this.response.status = status;
    return this;
  }

  setMessage(message = 'Response message') {
    this.response.message = message;
    return this;
  }

  build() {
    return this.response;
  }
}

export default ResponseBuilder;
