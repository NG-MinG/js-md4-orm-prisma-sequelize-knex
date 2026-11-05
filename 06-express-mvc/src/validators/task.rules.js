// Luật validate cho Task. Client gửi camelCase (dueDate, userId) → đổi sang tên field của Model.
const { isPositiveInt, isDate, pagination } = require('./common');

const STATUSES = ['todo', 'doing', 'done'];

function fields(body, { partial }) {
  const data = {};
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) errors.push({ field: 'title', message: 'title là bắt buộc' });
    else if (body.title.length > 200) errors.push({ field: 'title', message: 'title tối đa 200 ký tự' });
    else data.title = body.title.trim();
  }
  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') errors.push({ field: 'description', message: 'description phải là chuỗi' });
    else data.description = body.description;
  }
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) errors.push({ field: 'status', message: `status phải là một trong: ${STATUSES.join(', ')}` });
    else data.status = body.status;
  }
  if (body.dueDate !== undefined) {
    if (body.dueDate !== null && !isDate(body.dueDate)) errors.push({ field: 'dueDate', message: 'dueDate phải có dạng YYYY-MM-DD' });
    else data.due_date = body.dueDate;
  }
  if (!partial || body.userId !== undefined) {
    if (!isPositiveInt(body.userId)) errors.push({ field: 'userId', message: 'userId phải là số nguyên dương' });
    else data.user_id = Number(body.userId);
  }
  if (partial && !errors.length && !Object.keys(data).length) {
    errors.push({ field: null, message: 'Không có trường nào để cập nhật' });
  }
  return { data, errors };
}

module.exports = {
  create: (body) => fields(body, { partial: false }),
  update: (body) => fields(body, { partial: true }),

  list(query) {
    const errors = [];
    const { page, limit } = pagination(query, errors);
    const data = { page, limit };
    if (query.status !== undefined) {
      if (!STATUSES.includes(query.status)) errors.push({ field: 'status', message: `status phải là một trong: ${STATUSES.join(', ')}` });
      else data.status = query.status;
    }
    if (query.userId !== undefined) {
      if (!isPositiveInt(query.userId)) errors.push({ field: 'userId', message: 'userId phải là số nguyên dương' });
      else data.userId = Number(query.userId);
    }
    return { data, errors };
  },
};
