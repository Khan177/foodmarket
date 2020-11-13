const mongoose = require("mongoose");

const SubcategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }
})

const SubcategoryModel = mongoose.model("Subcategory", SubcategorySchema);

module.exports = SubcategoryModel;