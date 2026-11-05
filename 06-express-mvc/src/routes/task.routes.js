const { Router } = require('express');
const validate = require('../middlewares/validate');
const { idParam } = require('../validators/common');
const rules = require('../validators/task.rules');
const TaskController = require('../controllers/task.controller');

const router = Router();

router.get('/', validate(rules.list, 'query'), TaskController.index);
router.get('/:id', validate(idParam, 'params'), TaskController.show);
router.post('/', validate(rules.create), TaskController.store);
router.patch('/:id', validate(idParam, 'params'), validate(rules.update), TaskController.update);
router.delete('/:id', validate(idParam, 'params'), TaskController.destroy);

module.exports = router;
