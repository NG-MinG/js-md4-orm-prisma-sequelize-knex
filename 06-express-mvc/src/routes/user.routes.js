const { Router } = require('express');
const validate = require('../middlewares/validate');
const { idParam } = require('../validators/common');
const rules = require('../validators/user.rules');
const UserController = require('../controllers/user.controller');

const router = Router();

router.get('/', UserController.index);
router.get('/:id', validate(idParam, 'params'), UserController.show);
router.post('/', validate(rules.create), UserController.store);

module.exports = router;
