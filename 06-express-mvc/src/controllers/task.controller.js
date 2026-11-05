// C – Controller chỉ điều phối:
//   1. lấy input đã validate (req.valid)
//   2. gọi Model để đọc/ghi dữ liệu
//   3. chọn View để trả kết quả
// Controller KHÔNG tự dựng JSON và KHÔNG gọi res.json() trực tiếp.
const { Task, User } = require('../models');
const TaskView = require('../views/task.view');
const HttpError = require('../errors/http-error');

const withOwner = { model: User, as: 'owner', attributes: ['id', 'name'] };

async function findOrFail(id) {
  const task = await Task.findByPk(id, { include: [withOwner] });
  if (!task) throw HttpError.notFound(`Không tìm thấy task với id = ${id}`);
  return task;
}

async function ensureUser(userId) {
  if (userId !== undefined && !(await User.count({ where: { id: userId } }))) {
    throw HttpError.notFound(`Không tìm thấy user với id = ${userId}`);
  }
}

// GET /api/v1/tasks?page=&limit=&status=&userId=
exports.index = async (req, res) => {
  const { page, limit, status, userId } = req.valid.query;
  const where = {};
  if (status) where.status = status;
  if (userId) where.user_id = userId;

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [withOwner], // belongsTo → 1 JOIN, không N+1
    order: [['id', 'DESC']],
    limit,
    offset: (page - 1) * limit,
  });

  return TaskView.index(res, { rows, total: count, page, limit });
};

// GET /api/v1/tasks/:id
exports.show = async (req, res) => {
  const task = await findOrFail(req.valid.params.id);
  return TaskView.show(res, task);
};

// POST /api/v1/tasks
exports.store = async (req, res) => {
  const data = req.valid.body;
  await ensureUser(data.user_id);
  const task = await Task.create(data);
  return TaskView.created(res, await findOrFail(task.id));
};

// PATCH /api/v1/tasks/:id
exports.update = async (req, res) => {
  const task = await findOrFail(req.valid.params.id);
  await ensureUser(req.valid.body.user_id);
  await task.update(req.valid.body);
  return TaskView.show(res, await findOrFail(task.id));
};

// DELETE /api/v1/tasks/:id
exports.destroy = async (req, res) => {
  const task = await findOrFail(req.valid.params.id);
  await task.destroy(); // paranoid: chỉ set deleted_at
  return TaskView.deleted(res, task);
};
