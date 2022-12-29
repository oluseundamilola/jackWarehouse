const router = require("express").Router()
const Item = require("../models/FoodItem")
const ItemLocation = require("../models/Location")

const { AsyncLocalStorage } = require('async_hooks')
const asyncLocalStorage = new AsyncLocalStorage()


//CREATE A NEW FOOD ITEM
let sumFoodWeight = 0
let rowNumber = 1

router.post("/add", async (req,res) => {
    //GETTING NEW FOOD DETAILS FROM BODY
    let newItem = new Item({
        foodName: req.body.foodName,
        weight: req.body.weight,
        categories: req.body.categories,
        price: req.body.price,
        productionDate: req.body.productionDate,
        expiryDate: req.body.expiryDate,
        location: rowNumber
    })

    //GETTING NEW LOCATION DETAILS FROM BODY
    let newItemLocation = new ItemLocation({ 
        locationName: rowNumber,
        row: [
            {
                foodItemId: newItem.foodName,
                foodItemName: newItem.foodName,
                foodItemWeight: newItem.weight
            }
        ]
    })

    //GETTING FOOD WEIGHT FROM BODY
    let food_weight = newItem.weight

    //IF FOOD WEIGHT ENTERED IS GREATER THAN 10 SET EVERYTHING TO NULL
    if(food_weight > 10){
        console.log("No row can contain this")
        newItem = null
        newItemLocation = null
    }

    //STORING ALL FOOD WEIGHT ENTERED AND SUMING THEM
    sumFoodWeight += food_weight
    asyncLocalStorage.run(sumFoodWeight, async() => {
        console.log("****Sum of food Weight in tonnes")
        console.log(sumFoodWeight)
    })

    //CHECKING IF LOCATION DB IS EMPTY.
    //IF IT's EMPTY CREATE NEW LOCATION
    const ItemLocationInDb = await ItemLocation.find()
    if(ItemLocationInDb.length <= 0){
            await newItemLocation.save()
        // res.status(201).json(savedLocationItem)
    }

    //IF NOT EMPTY
    else if(ItemLocationInDb.length > 0){
        //  let freeSpace = await ItemLocation.findOne({locationName:rowNumber})
        //  console.log("****Free Space ****")
        //  console.log(freeSpace)

        if(sumFoodWeight <= 10){
            let toBeAdded = newItemLocation.row.pop()
            await ItemLocation.findOneAndUpdate({locationName:rowNumber},{ $push: { row: toBeAdded } })
        }
        else if(sumFoodWeight >= 10){
            rowNumber = rowNumber + 1
            sumFoodWeight = 0

            newItem = new Item({
                foodName: req.body.foodName,
                weight: req.body.weight,
                categories: req.body.categories,
                price: req.body.price,
                productionDate: req.body.productionDate,
                expiryDate: req.body.expiryDate,
                location: rowNumber
            })
            
            //CHECKING IF FOOD WEIGHT ENTERED IS ABOVE 10
            let foodWeight = newItem.weight
            if(foodWeight > 10){
                console.log("No row can contain this")
                newItem = null
                newItemLocation = null
            }       

            newItemLocation = new ItemLocation({ 
                locationName: rowNumber,
                row: [
                    {
                        foodItemId: newItem.foodName,
                        foodItemName: newItem.foodName,
                        foodItemWeight: newItem.weight
                    }
                ]
            })

            //GETTING FOOD WEIGHT FROM BODY
            let food_weight = newItem.weight

            //STORING ALL FOOD WEIGHT ENTERED AND SUMING THEM
            sumFoodWeight = food_weight

            console.log("***** WHEN FOOD_WEIGHT IS > THAN 10")
            console.log(sumFoodWeight)
            
            
            
            asyncLocalStorage.run(rowNumber, async() => {
                // console.log("*********This is row Number********")
                // console.log(rowNumber)
                })
            await newItemLocation.save()
        }
        
    }

    try{

        const savedItem = await newItem.save()
        res.status(200).json(savedItem)
        
    }catch(err){
        res.status(500).json(err)
    }
})  




//UPDATE
router.put("/update/:id", async(req,res) => {
    try{
        const updatedFoodItem = await Item.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{new:true})
        res.status(200).json(updatedFoodItem)
    }catch(err){
        res.status(500).json(err)
    }
})



//DELETE
router.delete("/delete/:id", async(req,res) => {
    try{
        await Item.findByIdAndDelete(req.params.id)
        res.status(200).json("Food Item has been deleted.")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET A SINGLE FOOD ITEM
router.get("/find/:id", async(req,res) => {
    try{
        const foodItem = await Item.findById(req.params.id)
        res.status(200).json(foodItem)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET ALL FOOD_ITEM
router.get("/", async(req,res) => {
    const qCategory = req.query.category

    try{
        let food_item;

        if(qCategory){
            food_item = await Item.find({
                categories: {
                    $in: [qCategory]
                }
            })
        }
        else{
            food_item = await Item.find()
        }

        res.status(200).json(food_item)

    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports = router
