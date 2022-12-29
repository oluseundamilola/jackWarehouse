const mongoose = require("mongoose")

const FoodItemSchema = new mongoose.Schema(
    {
        foodName: { type:String, required: true, unique:true },
        weight: { type: Number, required: true, },
        categories: { type:Array },
        price: { type: Number, required: true },
        productionDate: { type: String, required: true, },
        expiryDate: { type: String, required: true, },
        location: { type: String, required: true, }
    },
    { timestamps: true }
)

module.exports = mongoose.model("FoodItem", FoodItemSchema)