const userRouter = require('./userRoute')
const productRouter = require('./productRoute')
const { notFound, errHandle, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes