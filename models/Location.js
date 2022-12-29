const mongoose = require("mongoose")

const LocationSchema = new mongoose.Schema({

    locationName: { type: String, required: true },
    row: [
        {
        foodItemId: { type:String, required: true },
        foodItemName: { type:String, required: true },
        foodItemWeight: { type:Number, required: true }
        }
    ]
})

module.exports = mongoose.model("Location", LocationSchema)

