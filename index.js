const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8r6on.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
});

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic")
        const servicesCollection = database.collection("services");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET SINGLE SERVICE
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            console.log("specific service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // POST API
        app.post("/services", async (req, res) => {
            const service = req.body;
            console.log("hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log("success", result);
            res.json(result);
        });

        // DELETE API
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running serverheroku login");
});

app.get("/hello", (req, res) => {
    res.send("hello updated here")
})

app.listen(port, () => {
    console.log("listening on port", port);
});

/*
one time:
1. Heroku account open
2. Heroku software install

every time
1. git init
2. git ignore (node_modules, .env)
3. push everything to git
4. make sure you have this "start": "node index.js"
5. make sure put process.env.PORT
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main


----------------------------------------------------------------
Update: 
1. git add, commit, push
2. 
*/