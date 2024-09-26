const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const MONGO_URI = process.env.MONGO_URI;


const app = express();
const port = 3000;
app.use(express.json())
app.use(cors())

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to DB")
    })

const userSchema = new mongoose.Schema({
    productName: String,
    price: Number,
})
const UserModel = mongoose.model('collection-2', userSchema)

app.post('/', async (req, res) => {
    const { productName, price } = req.body; // Adjust these fields based on your user model

    try {
        // Create a new user instance
        const newProduct = new UserModel({ productName, price });

        // Save the user to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
})

app.get('/', async (req, res) => {
    try {
        const userData = await UserModel.find({});
        res.json({ "rules": "Use This Route to handle single data: /findusers/:id", "data": userData });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
})

app.get('/:id', async (req, res) => {
    const product = await UserModel.findById(req.params.id);

    if (!product) {
        res.status(404).send('Product is not found')
    }
    res.status(200).send(product)
    console.log(product)
})

app.put('/:id', async (req, res) => {
    try {
        const product = await UserModel.findByIdAndUpdate(req.params.id,
            { productName, price },
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).send('Product is not found')
        }

        res.status(200).send(product)
        console.log(product)
    } catch (error) {
        res.status(400).json({ message: 'Error updating product', error });
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const product = await UserModel.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).send("Successfully Deleted")
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
})



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})