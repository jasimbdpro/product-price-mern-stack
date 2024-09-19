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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})