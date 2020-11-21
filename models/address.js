const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    }
})

const AddressModel = mongoose.model("Address", AddressSchema);

module.exports = AddressModel;