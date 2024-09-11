const User = require('../models/user')
const asyncHandler = require('express-async-handler')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body
    if (!email || !password || !lastName || !firstName)
        return res.status(400).json({
            sucess: false,
            mes: 'Missing inputs'
        })
    const response = await User.create(req.body)
    return res.status(200).json({
        sucess: response ? true : false,
        response
    })
})

module.exports = {
    register
}