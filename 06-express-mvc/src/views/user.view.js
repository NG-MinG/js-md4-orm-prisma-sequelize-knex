// V – User được trình bày ra ngoài như thế nào.
// - ẩn password_hash (không bao giờ rời khỏi server)
// - đổi tên snake_case trong DB → camelCase cho client
// - cấu trúc JSON ổn định: đổi tên cột trong DB không làm vỡ API, chỉ sửa ở đây
const { success } = require('./base.view');
const TaskView = require('./task.view');

function summary(user) {
  if (!user) return null;
  return { id: user.id, name: user.name };
}

function serialize(user) {
  const json = {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
  // Trường tuỳ chọn: chỉ có khi controller đã nạp sẵn
  if (user.get('taskCount') !== undefined) json.taskCount = Number(user.get('taskCount'));
  if (user.tasks) json.tasks = user.tasks.map(TaskView.serializeShort);
  return json;
}

module.exports = {
  summary,
  serialize,
  index: (res, users) => success(res, users.map(serialize)),
  show: (res, user) => success(res, serialize(user)),
  created: (res, user) => success(res, serialize(user), { status: 201 }),
};
