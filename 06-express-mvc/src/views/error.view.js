// V – mọi lỗi đều được trình bày qua đây, cùng một khuôn JSON
const { failure } = require('./base.view');

module.exports = {
  badRequest: (res, message = 'Dữ liệu không hợp lệ', errors) => failure(res, 400, message, errors),
  notFound: (res, message = 'Không tìm thấy') => failure(res, 404, message),
  conflict: (res, message = 'Dữ liệu đã tồn tại', errors) => failure(res, 409, message, errors),
  internal: (res) => failure(res, 500, 'Lỗi hệ thống'), // không bao giờ trả chi tiết lỗi/SQL
  render: (res, status, message, errors) => failure(res, status, message, errors),
};
