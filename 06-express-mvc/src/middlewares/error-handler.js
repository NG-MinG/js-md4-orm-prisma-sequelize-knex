// Bắt mọi lỗi, quyết định mã HTTP, rồi giao cho ErrorView trình bày
const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const HttpError = require('../errors/http-error');
const ErrorView = require('../views/error.view');

const UNIQUE_MESSAGES = {
  tasks_user_id_title_unique: { field: 'title', message: 'User này đã có task trùng tiêu đề' },
  email: { field: 'email', message: 'email đã được sử dụng' },
  users_email: { field: 'email', message: 'email đã được sử dụng' },
};

function uniqueErrors(err) {
  const keys = Object.keys(err.fields || {});
  return (keys.length ? keys : err.errors.map((e) => e.path))
    .map((k) => UNIQUE_MESSAGES[k] || { field: k, message: `${k} đã tồn tại` });
}

// 404 cho route không tồn tại
exports.notFound = (req, res) => ErrorView.notFound(res, `Không tìm thấy ${req.method} ${req.originalUrl}`);

// eslint-disable-next-line no-unused-vars
exports.handler = (err, req, res, next) => {
  if (err instanceof HttpError) return ErrorView.render(res, err.status, err.message, err.errors);
  if (err.type === 'entity.parse.failed') return ErrorView.badRequest(res, 'Body JSON không hợp lệ');

  // UniqueConstraintError là lớp con của ValidationError → kiểm tra trước
  if (err instanceof UniqueConstraintError) return ErrorView.conflict(res, 'Dữ liệu đã tồn tại', uniqueErrors(err));
  if (err instanceof ValidationError) {
    return ErrorView.badRequest(res, 'Dữ liệu không hợp lệ', err.errors.map((e) => ({ field: e.path, message: e.message })));
  }
  if (err instanceof ForeignKeyConstraintError) return ErrorView.badRequest(res, 'Tham chiếu tới bản ghi không tồn tại');

  console.error(err); // chi tiết chỉ nằm ở log server
  return ErrorView.internal(res);
};
