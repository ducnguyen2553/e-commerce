const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

    },
    discount: {
        type: Number,
        required: true,
        unique: true,
    },
    expiry: {//hạn sử dụng
        type: Date,
        required: true,
    },

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);