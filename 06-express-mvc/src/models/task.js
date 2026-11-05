// M – Task
const { Model, DataTypes } = require('sequelize');

const STATUSES = ['todo', 'doing', 'done'];

module.exports = (sequelize) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, { as: 'owner', foreignKey: 'user_id' });
    }

    // Logic nghiệp vụ đặt trong Model, không đặt trong View hay Controller
    isOverdue(today = new Date().toISOString().slice(0, 10)) {
      return this.status !== 'done' && !!this.due_date && this.due_date < today;
    }
  }

  Task.init(
    {
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: { notEmpty: { msg: 'title không được rỗng' }, len: { args: [1, 200], msg: 'title tối đa 200 ký tự' } },
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM(...STATUSES),
        allowNull: false,
        defaultValue: 'todo',
        validate: { isIn: { args: [STATUSES], msg: `status phải là một trong: ${STATUSES.join(', ')}` } },
      },
      due_date: { type: DataTypes.DATEONLY, validate: { isDate: { msg: 'dueDate phải có dạng YYYY-MM-DD' } } },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'Task', tableName: 'tasks', underscored: true, paranoid: true },
  );

  Task.STATUSES = STATUSES;
  return Task;
};
