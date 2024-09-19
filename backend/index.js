const express = require('express');
const cors = require('cors')
const app = express();
const port = 3000;
app.use(express.json())
app.use(cors())


let productData = [];
let nextId = 1;

app.post('/', (req, res) => {
    const body = req.body;
    const product = { id: nextId++, ...body };
    productData.push(product);
    res.status(200).send(body);
    console.log(product)
})

app.get('/', (req, res) => {
    res.status(200).send(productData)
})

app.get('/:id', (req, res) => {
    const product = productData.find(product => product.id === parseInt(req.params.id))

    if (!product) {
        res.status(404).send('Product is not found')
    }
    res.status(200).send(product)
    console.log(product)
})

app.put('/:id', (req, res) => {
    const product = productData.find(product => product.id === parseInt(req.params.id))

    if (!product) {
        res.status(404).send('Product is not found')
    }
    Object.keys(req.body).forEach(key => {
        product[key] = req.body[key];
    })
    res.status(200).send(product)
    console.log(product)
})

app.delete('/:id', (req, res) => {
    const index = productData.findIndex(product => product.id === parseInt(req.params.id))

    if (!index) {
        res.status(404).send('Product is not found')
    }
    productData.splice(index, 1)
    res.status(200).send("Successfully Deleted")
    console.log("Successfully Deleted")
})



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})