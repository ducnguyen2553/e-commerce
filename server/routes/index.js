const userRouter = require('./userRoute')

const initRoutes = (app)=>{
    app.use('/api/user', userRouter)
}

module.exports = initRoutes