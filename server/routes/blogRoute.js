const router = require('express').Router()
const ctrls = require('../controllers/blogController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.get('/', ctrls.getAllBlogs)
router.get('/one/:bid', ctrls.getBlog)
router.put('/like/:bid', verifyAccessToken, ctrls.likeBlog)
router.put('/image/:bid', [verifyAccessToken, isAdmin], uploader.single('image'), ctrls.uploadImagesBlog)
router.put('/dislike/:bid', verifyAccessToken, ctrls.dislikeBlog)
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.put('/update/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBlog)

module.exports = router