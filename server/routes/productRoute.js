const router = require('express').Router()
const ctrls = require('../controllers/productController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getAllProducts)
router.put('/ratings', verifyAccessToken, ctrls.ratings)


router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.single('images'), ctrls.uploadImagesProduct)
router.put('/:pid', [verifyAccessToken, isAdmin], ctrls.updateProduct)
router.delete('/:pid', [verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.get('/:pid', ctrls.getProduct)


module.exports = router