const router = require('express').Router()
const ctrls = require('../controllers/blogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.get('/', ctrls.getAllBlogs)
router.put('/like', verifyAccessToken, ctrls.likeBlog)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)

module.exports = router