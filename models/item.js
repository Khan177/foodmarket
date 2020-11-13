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
        type: Number,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    subcategoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
})

const ItemModel = mongoose.model("Subcategory", ItemSchema);

module.exports = ItemModel;