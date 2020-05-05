const express = require("express");
const app = express();
const fs = require("fs");
const jsonParser = express.json();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId; //for by "_id" search

// create a MongoClient object and pass the connection string to it
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    app.locals.db = client.db("phone-book");
    app.locals.contacts = app.locals.db.collection("contacts");

    app.listen(3000, function () {
        console.log("Listening port :3000");
    });
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/setContactPage", (req, res) => {
    res.render("addContact.ejs");
});

app.post('/deleteContact', jsonParser, (req, res) => {
    let contact = req.body;
    var search_id = new ObjectId(contact._id);
    app.locals.contacts.deleteOne({ _id: search_id });
    res.redirect('/');
});

app.post('/editContact', jsonParser, (req, res) => {
    let contact = req.body;

    for (let key in contact) { // delete all empty keys
        if (contact[key] === '') {
            delete contact[key];
        }
    }

    if (Object.keys(contact).length !== 1) { // if contact is not empty

        var search_id = new ObjectId(contact._id);
        contact._id = search_id;
        app.locals.contacts.deleteOne({ _id: search_id });// delete old document from collection
        app.locals.contacts.insertOne(contact);           // insert new document to collection

    } else {

        var search_id = new ObjectId(contact._id);
        contact._id = search_id;
        app.locals.contacts.deleteOne({ _id: search_id });// deleted old document from collection
    }
    res.redirect("/");
});

app.post("/setContact", jsonParser, (req, res) => {

    let contact = req.body;//get contact from query

    var search_id = new ObjectId(contact._id);
    contact._id = search_id;
    if (Object.keys(contact).length !== 1) { // if contact is not empty

        app.locals.contacts.insertOne(contact, function (err, result) {
            if (err) console.log(err)
        });

        res.json(req.body);
    } else {
        res.redirect("/setContact");
    }

    if (!req.body) return res.sendStatus(400);


});

app.get("/getFilteredContacts", (req, res) => {
      
    app.locals.contacts.find().toArray().then(data => { //returned data from the database to the client
        res.json(data);
    });

});

app.get("/getContacts", (req, res) => {
    app.locals.contacts.find().toArray().then(data => { //returned data from the database to the client
        res.json(data);
    });
});