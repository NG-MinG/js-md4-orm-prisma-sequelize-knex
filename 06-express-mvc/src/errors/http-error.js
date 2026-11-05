// Lỗi có mã HTTP — controller/middleware ném ra, error handler chuyển cho ErrorView trình bày
class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) { return new HttpError(400, message, errors); }
  static notFound(message) { return new HttpError(404, message); }
}

module.exports = HttpError;
