const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})

const AddressModel = mongoose.model("Address", AddressSchema);

module.exports = AddressModel;