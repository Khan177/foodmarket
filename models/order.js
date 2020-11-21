const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentInfo: {
        type: String,
        required: true,
    },
    products: {
        type: [Object],
        required: true,
    },
    status: {
        type: Number,
        default: 0,
    }
})

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;