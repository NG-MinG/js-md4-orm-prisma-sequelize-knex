const { Router } = require('express');

const router = Router();

router.use('/users', require('./user.routes'));
router.use('/tasks', require('./task.routes'));

module.exports = router;
