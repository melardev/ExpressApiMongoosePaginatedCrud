const todosController = require('../controllers/todos.controller');
const router = require('express').Router();
const initPage = require('../middlewares/paging.middleware').initPage;


router.get('', initPage, todosController.getAll);
router.get('/completed', initPage, todosController.getCompleted);
router.get('/pending', initPage, todosController.getPending);

router.get('/:id', initPage, todosController.getById);

router.post('', todosController.create);
router.put('/:id', todosController.update);
router.delete('/:id', todosController.delete);
router.delete('', todosController.deleteAll);

// The simple formatted responses, for absolute beginners that do not want to deal with DTOs
router.get('/all/simple', initPage, todosController.getAllSimple);
router.get('/completed/simple', initPage, todosController.getCompletedSimple);
router.get('/pending/simple', initPage, todosController.getPendingSimple);
router.get('/:id/simple', initPage, todosController.getByIdSimple);

module.exports = router;
