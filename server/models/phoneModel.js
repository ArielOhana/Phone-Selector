const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    properties: {
        type: [{
            category: String,
            value: String
        }],
        required: true,
    },
    rating: {
        type: [{
            category: String,
            value: String
        }],
        required: true,
    },
}, { timestamps: true });

const Phone = mongoose.model("Phone", phoneSchema);
module.exports = Phone;