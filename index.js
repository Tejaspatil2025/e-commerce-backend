const PORT = 4000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const path = require('path')

app.use(express.json())
app.use(cors())

//connection with mongodb
mongoose.connect('mongodb+srv://tejaspatil2025:2525252@cluster0.waudncq.mongodb.net/e-commerce')

//api creation

app.get('/', (req, res) => {
    res.send('Express App is running')
})

// image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb) => {
        return cb(null , `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

// creating upload endpoint for images
app.use('/images', express.static(path.join(__dirname , 'upload/images')))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url:`http://localhost:${PORT}/images/${req.file.filename}`
    })
})

//  schema for creating products

const Products = mongoose.model("Product",{
    id: {
        type: Number,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    image: {
        type: String,
        required:true
    },
    category: {
        type: String,
        required:true
    },
    new_price: {
        type: Number,
        required:true
    },
    old_price: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
        default:Date.now
    },
    available: {
        type: Boolean,
        default:true
    }
})

app.post('/addproduct', async (req, res) => {
    let products = await Products.find({ })
    const product = new Products({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product)
    await product.save();
    console.log('Saved')
    res.json({
        success: true,
        name: req.body.name 
    })
})

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running on PORT : ${PORT}`)
    }
    else {
        console.log(`Error : ${error}`)
    }
})