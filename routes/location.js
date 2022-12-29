const router = require("express").Router()
const Item = require("../models/FoodItem")
const ItemLocation = require("../models/Location")

//CREATE FOOD ITEM LOCATION
router.post("/", async(req,res) => {
    const newLocation = new ItemLocation(req.body)
    try{
        const savedLocation = await newLocation.save()
        res.status(200).json(savedLocation)

    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router
