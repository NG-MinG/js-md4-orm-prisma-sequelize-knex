// C – User
const { User, Task, sequelize } = require('../models');
const UserView = require('../views/user.view');
const HttpError = require('../errors/http-error');

// GET /api/v1/users — kèm số task của mỗi user bằng subquery, vẫn chỉ 1 câu SQL
exports.index = async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['password_hash'],
      include: [[
        sequelize.literal('(SELECT COUNT(*) FROM tasks t WHERE t.user_id = `User`.`id` AND t.deleted_at IS NULL)'),
        'taskCount',
      ]],
    },
    order: [['id', 'ASC']],
  });
  return UserView.index(res, users);
};

// GET /api/v1/users/:id — kèm danh sách task
exports.show = async (req, res) => {
  const { id } = req.valid.params;
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password_hash'] },
    include: [{ model: Task, as: 'tasks' }],
    order: [[{ model: Task, as: 'tasks' }, 'id', 'ASC']],
  });
  if (!user) throw HttpError.notFound(`Không tìm thấy user với id = ${id}`);
  return UserView.show(res, user);
};

// POST /api/v1/users — password được băm trong hook của Model, View không bao giờ trả hash
exports.store = async (req, res) => {
  const user = await User.create(req.valid.body);
  return UserView.created(res, user);
};
