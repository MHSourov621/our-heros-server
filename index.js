const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsr81r8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db('ourHerosDb').collection('products');


        app.get('/products', async(req, res) => {
            const cursor = productCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/category/:category', async(req, res) => {
            const result = await productCollection.find({ category: req.params.category }).toArray();
            res.send(result)
        })

        app.get('/products/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const product = await productCollection.findOne(query);
            console.log(product)
            res.send(product)
        })

        app.post('/products', async(req, res) => {
            const newHero = req.body;
            console.log(newHero);
            const result = await productCollection.insertOne(newHero);
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Our heros server is running")
})

app.listen(port, () => {
    console.log(`Our heros server is running on port ${port}`);
})