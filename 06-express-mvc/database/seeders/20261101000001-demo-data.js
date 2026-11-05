'use strict';

const crypto = require('crypto');

// Cùng cách băm với hook trong models/user.js (bulkInsert không chạy hook của Model)
function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `scrypt$${salt}$${crypto.scryptSync(plain, salt, 64).toString('hex')}`;
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const ts = { created_at: now, updated_at: now };
    const hash = hashPassword('123456'); // mật khẩu demo cho cả 3 user

    await queryInterface.bulkInsert('users', [
      { id: 1, name: 'An', email: 'an@mail.com', password_hash: hash, ...ts },
      { id: 2, name: 'Binh', email: 'binh@mail.com', password_hash: hash, ...ts },
      { id: 3, name: 'Chi', email: 'chi@mail.com', password_hash: hash, ...ts },
    ]);

    const titles = [
      'Viet migration', 'Viet seeder', 'Dinh nghia model', 'Khai bao association',
      'Viet view', 'Viet controller', 'Khai bao route', 'Validate request',
      'Xu ly loi', 'Phan trang', 'Loc theo status', 'Postman collection',
    ];
    const statuses = ['todo', 'doing', 'done'];
    await queryInterface.bulkInsert('tasks', titles.map((title, i) => ({
      title,
      description: `Mo ta: ${title}`,
      status: statuses[i % 3],
      due_date: `2026-11-${String(10 + i).padStart(2, '0')}`,
      user_id: (i % 3) + 1,
      ...ts,
    })));
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
