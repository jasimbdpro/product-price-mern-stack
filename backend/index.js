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

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
})
const ProductModel = mongoose.model('collection-2', productSchema)

app.post('/', async (req, res) => {
    const { productName, price } = req.body; // Adjust these fields based on your user model

    try {
        // Create a new user instance
        const newProduct = new ProductModel({ productName, price });

        // Save the user to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', newProduct });
    } catch (error) {
        res.status(400).json({ message: 'Error creating product', error });
    }
})

app.get('/', async (req, res) => {
    try {
        const productData = await ProductModel.find({});
        res.status(200).json(productData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
})

app.get('/:id', async (req, res) => {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
        res.status(404).send('Product is not found')
    }
    res.status(200).send(product)
    console.log(product)
})

app.put('/:id', async (req, res) => {
    try {
        const { productName, price } = req.body;
        const product = await ProductModel.findByIdAndUpdate(req.params.id,
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
        const product = await ProductModel.findByIdAndDelete(req.params.id);

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