// Middleware validate dùng chung: nhận một hàm rules(source) → { data, errors }
//   data   : dữ liệu đã làm sạch, đổi sang tên field của Model (chỉ các field được phép)
//   errors : [{ field, message }] — có lỗi thì trả 400 ngay, không chạm tới Controller
const HttpError = require('../errors/http-error');

const validate = (rules, source = 'body') => (req, res, next) => {
  const { data, errors } = rules(req[source] || {});
  if (errors.length) throw HttpError.badRequest('Dữ liệu không hợp lệ', errors);
  req.valid = { ...req.valid, [source]: data };
  next();
};

module.exports = validate;
