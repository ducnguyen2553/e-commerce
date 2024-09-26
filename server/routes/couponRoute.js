const router = require('express').Router()
const ctrls = require('../controllers/couponController')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupon)
router.get('/', ctrls.getAllCoupons)

module.exports = router