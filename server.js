const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const port = process.env.PORT || 8000;
// Use the array below to store the users. Add/remove/update items in it based off
let storage = [];
app.use(bodyParser.json());

// all users
app.get('/users', (req, res) => {
    res.send(JSON.parse(fs.readFileSync("./storage.json", "utf8")))
})

// search user by name
app.get('/users/:name', (req, res) => {
    fs.readFile("./storage.json", "utf8", (err, data) => {
        let parsedData = JSON.parse(data);
        let matchedUser = parsedData.filter((item) => {
            return item.name === req.params.name;
        })

        if (matchedUser.length >= 1) {
            res.json(matchedUser[0])
        } else {
            res.sendStatus(40)
        }
    })
})

// create user
app.post('/create', function(req, res) {
    var newUser = req.body;
    //  newUser = { "name": "test", "email" : "info@test.com", "state" : "AZ"}
    let contents = fs.readFileSync('./storage.json', 'utf-8');
    let contentsArray = JSON.parse(contents);
    contentsArray.push(newUser);
    var newContents = fs.writeFileSync('./storage.json', JSON.stringify(contentsArray));
    res.json(contentsArray);
});

// delete user

app.delete('/users/:name', (req, res) => {
    let contents = fs.readFileSync('./storage.json', 'utf-8');
    let contentsArray = JSON.parse(contents);
    let newArr = contentsArray.filter((user) => {
        return user.name !== req.params.name
    })
    var newContents = fs.writeFileSync('./storage.json', JSON.stringify(newArr));
    res.send(newArr);
})

// update
app.put('/users/:name', function(req, res) {
    var data = fs.readFileSync(`./storage.json`)
    var arr = JSON.parse(data)
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].name === req.params.name) {
            arr[i] = req.body;
            var string = JSON.stringify(arr)
            fs.writeFileSync(`./storage.json`, string)
            res.end('updated')
        }
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})