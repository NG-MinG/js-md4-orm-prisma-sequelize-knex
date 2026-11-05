require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = Number(process.env.PORT || 3000);

(async () => {
  try {
    await sequelize.authenticate(); // schema do migration quản lý, KHÔNG dùng sync()
    app.listen(PORT, () => console.log(`API chạy tại http://localhost:${PORT}/api/v1`));
  } catch (err) {
    console.error('Không kết nối được database:', err.message);
    process.exit(1);
  }
})();
