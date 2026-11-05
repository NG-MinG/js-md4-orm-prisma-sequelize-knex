// V – Task được trình bày ra ngoài như thế nào.
const { success, paginationMeta } = require('./base.view');

// Bản rút gọn — dùng khi task nằm lồng trong user
function serializeShort(task) {
  return { id: task.id, title: task.title, status: task.status, dueDate: task.due_date };
}

// Bản đầy đủ
function serialize(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.due_date,
    isOverdue: task.isOverdue(), // giá trị tính toán từ Model, View chỉ trình bày
    owner: task.owner ? { id: task.owner.id, name: task.owner.name } : undefined,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    // KHÔNG trả deletedAt, user_id thô — client dùng owner.id
  };
}

module.exports = {
  serialize,
  serializeShort,

  index: (res, { rows, total, page, limit }) =>
    success(res, rows.map(serialize), { meta: paginationMeta({ page, limit, total }) }),

  show: (res, task) => success(res, serialize(task)),

  created: (res, task) => success(res, serialize(task), { status: 201 }),

  deleted: (res, task) => success(res, { id: task.id, deleted: true }),
};
