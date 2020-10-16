const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const MongoClient = require('mongodb').MongoClient;
const objectID = require('mongodb').ObjectID;
require('dotenv').config()

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkovl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('images'));
app.use(fileUpload());


client.connect(err => {

    const servicesCollection = client.db("creativeAgency").collection("services");
    const feedbackCollection = client.db("creativeAgency").collection("feedback");
    const ordersCollection = client.db("creativeAgency").collection("orders");
    const adminCollection = client.db("creativeAgency").collection("admin");

    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({title, description, image})
        .then(result => {

        })
    })

    app.get('/feedback', (req, res) => {
        feedbackCollection.find({})
        .toArray((err, document) => {
            res.send(document);
        })
    })

    app.post('/giveFeedback', (req, res) => {
        const feedback = req.body;
        feedbackCollection.insertOne(feedback)
        .then(result => {

        })
        console.log(feedback);
    })

    app.post('/placeOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const category = req.body.category;
        const details = req.body.details;
        const price = req.body.price;
        const status = req.body.status;
        const color = req.body.color;
        const bg = req.body.bg;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        ordersCollection.insertOne({name, email, category, details, price, status, color, bg, image})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/userOrders/:email', (req, res) => {
        const email = req.params.email;
        ordersCollection.find({ email: email})
        .toArray((err, document) => {
            res.send(document)
        })
    })

    app.get('/servicesList', (req, res) => {
        ordersCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.color)
    })

    app.post('/addAdmin', (req, res) => {
        const email = req.body;
        adminCollection.insertOne(email)
        .then(result => {
            
        })
    })

    app.get('/admins', (req, res) => {
        adminCollection.find({})
        .toArray((err, document) => {
            res.send(document)
        })
    })


    console.log("Database connected");
});



app.listen(process.env.PORT || port);