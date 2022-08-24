const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const db = require('./Database/db')

const path = require('path');

const media = path.join(__dirname, '')

const Admin = require('./Routes/adminRoutes');
const User = require('./Routes/userRoutes');
const Product = require('./Routes/productRoutes');
const AddToCart = require('./Routes/addToCartRoutes');
const Review = require('./Routes/reviewRoutes');


const app = express()


app.use(bodyParser.urlencoded({extended:false}))

app.use(express.json())
app.use(cors());
app.use(express.static(media))

app.use(Admin);
app.use(User);
app.use(Product);
app.use(AddToCart);
app.use(Review);

const port = 8000

app.listen(port, () => {
    console.log(`ClothingRool running on port localhost:${port}`)
  })