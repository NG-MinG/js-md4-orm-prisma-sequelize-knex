// M – User: dữ liệu + quy tắc nghiệp vụ của chính nó (validate, băm mật khẩu).
// Model KHÔNG biết gì về HTTP hay JSON trả về — việc đó thuộc về View.
const crypto = require('crypto');
const { Model, DataTypes } = require('sequelize');

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, { as: 'tasks', foreignKey: 'user_id' });
    }

    verifyPassword(plain) {
      const [, salt, hash] = this.password_hash.split('$');
      const check = crypto.scryptSync(plain, salt, 64).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: { msg: 'name không được rỗng' }, len: { args: [1, 100], msg: 'name tối đa 100 ký tự' } },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: { msg: 'email không đúng định dạng' } },
      },
      // VIRTUAL: nhận mật khẩu thô từ controller, không có cột trong DB
      password: {
        type: DataTypes.VIRTUAL,
        validate: { len: { args: [6, 100], msg: 'password tối thiểu 6 ký tự' } },
      },
      password_hash: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      hooks: {
        // Hook chạy trước validate → password_hash có giá trị trước khi kiểm tra NOT NULL
        beforeValidate(user) {
          if (user.password) user.password_hash = hashPassword(user.password);
        },
      },
    },
  );

  return User;
};
