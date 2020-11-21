const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    subcategoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
})

const ItemModel = mongoose.model("Item", ItemSchema);

module.exports = ItemModel;