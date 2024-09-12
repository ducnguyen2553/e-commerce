const userRouter = require('./userRoute')
const { notFound, errHandle, errHandler } = require('../middlewares/errHandler')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)



    app.use(notFound)
    app.use(errHandler)
}

module.exports = initRoutes