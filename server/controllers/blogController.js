const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body
    if (!title || !description || !category) throw new Error('Missing input')
    const response = await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})
const getAllBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find()
    return res.json({
        success: response ? true : false,
        Blogs: response ? response : 'Cannot get all blogs'
    })
})
const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Missing input')
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updateBlog: response ? response : 'Cannot update blog'
    })
})
//LIKE
//DISLIKE

/*
khi có người dùng like 1 bài blog thì :
1. check xem người đó trước đó có dislike hay không => bỏ dislike
2. check xem người đó trước đó có like hay không => bỏ like
*/
//pull: kéo ra
//push : thêm vào
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { bid } = req.body
    if (!bid) throw new Error('Missing input')
    const blog = await Blog.findById(bid)
    const alreadyDisliked = blog?.disLikes?.find(el => el.toString() === _id)
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { disLikes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            result: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true })
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
})

module.exports = {
    createNewBlog,
    updateBlog,
    getAllBlogs,
    likeBlog
}