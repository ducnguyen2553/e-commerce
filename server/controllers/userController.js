const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body
    if (!email || !password || !lastName || !firstName)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed!')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            success: newUser ? true : false,
            mes: newUser ? 'Register is successfully .  Please go login' : ' Something went wrong'
        })
    }
})
//refresh token => cấp mới access token
//access token => xác thực user, phân quyền user
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    //plain object
    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        //tách password và role ra khỏi respone
        const { password, role, refreshToken, ...userData } = response.toObject()
        //tạo access token
        const accessToken = generateAccessToken(response._id, role)
        //tạo refresh token
        const newRefreshToken = generateRefreshToken(response._id)
        //lưu refresh token vào db
        await User.findByIdAndUpdate(response.id, { newRefreshToken }, { new: true })
        //lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password -role')
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // lấy token từ cookies
    const cookie = req.cookies
    // check có token hay ko
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookie')
    //check token có hợp lệ hay ko
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
    })

})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookies')
    //xóa refresh token ở db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done'
    })
})

// client gửi email
// Server check gmail có hợp lệ hay ko => gửi mail + kèm theo link(password change token)
//client check mail => link
//client gửi api kèm token
//check token có giống với token mà server gửi mail hay ko
//change password

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email !')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Please click in link to change your password.Expires 15 minutes from now.
    <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
})
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing input')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangeAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Update password' : 'Something went wrong'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const response = await User.find().select('-refreshToken -password ')
    return res.status(200).json({
        success: response ? true : false,
        users: response
    })
})
const deleteUsers = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Missing user')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deleteUsers: response ? `User with email ${response.email} have delete` : 'No user delete'
    })
})
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select(' -password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'ERROR'
    })
})
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid || Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'ERROR'
    })
})
const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing input')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity, color } = req.body
    if (!pid || !quantity || !color) throw new Error('Missing input')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updateUser: response ? response : 'Something went wrong'
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updateUser: response ? response : 'Something went wrong'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updateUser: response ? response : 'Something went wrong'
        })
    }
})


module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUsers,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart
} 