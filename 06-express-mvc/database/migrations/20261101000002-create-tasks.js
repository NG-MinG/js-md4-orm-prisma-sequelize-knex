'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(200), allowNull: false },
      description: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('todo', 'doing', 'done'), allowNull: false, defaultValue: 'todo' },
      due_date: { type: Sequelize.DATEONLY },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('tasks', ['status']);
    await queryInterface.addIndex('tasks', ['user_id', 'title'], { unique: true, name: 'tasks_user_id_title_unique' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tasks');
  },
};
