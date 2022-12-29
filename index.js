const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const foodItemRoute = require("./routes/foodItem")
// const foodLocationRoute = require("./routes/location")


dotenv.config()


mongoose.connect(
    process.env.MONGO_URL
).then( () => console.log("DB connection is Successful!!") )
.catch( (err) => {
    console.log(err)
} )
app.use(express.json())
app.use("/api/foods", foodItemRoute)
// app.use("/api/location", foodLocationRoute)



app.listen( 8080, () => {
    console.log("Backend server is running!")
})





