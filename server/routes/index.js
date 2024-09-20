const userRouter = require('./userRoute')
const productRouter = require('./productRoute')
const productCategoryRouter = require('./productCategoryRoute')
const blogCategoryRouter = require('./blogCategoryRoute')
const { notFound, errHandle, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/productCategory', productCategoryRouter)
    app.use('/api/blogCategory', blogCategoryRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes