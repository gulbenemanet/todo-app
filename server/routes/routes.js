const router = require('express').Router();
const authController = require('../controllers/authController');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation')
const User = require('../models/User_Validation')
const Todo = require('../models/Todo_Validation')
const upload = require("../middleware/upload")

router.get('/api', (req, res) => {
    res.json({"users":["userOne","userTwo","user3"]})
})
router.post('/signUp', validate(User), authController.signUp);
router.post('/signIn', authController.signIn);
router.get('/me', authController.me)
router.get('/logout', auth, authController.logOut)

router.get('/allTodos', auth, todoController.getAllTodos) // user middleware req.user ekle bütün todolara
router.post('/addTodo', auth, upload.single("file"), todoController.addTodo)
router.delete('/deleteTodo', todoController.deleteTodo)
router.put('/updateTodo', todoController.updateTodo)
router.put('/statusTodo', todoController.statusTodo)
router.get('/search/:aranacak', auth, todoController.searchTodos)

router.get('/download/:fileName', auth, todoController.download)

// delete ve puttaki req.body.id yani görevin id si güncellenmesi gerek

module.exports = router;