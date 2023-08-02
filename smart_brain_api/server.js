const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express();

//need the json parser module that is contained here for express to interpret JSON.
// using express.json instead of the body parser module.
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors())
//this is the database that we will be comparing with.
const database = {
    users: [
        {
            id: '123',
            name: 'john',
            password: 'cookies',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            password: 'bannanas',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    // login: [
    //     {
    //         id: '987',
    //         hash: '',
    //         email: 'john@gmail.com'
    //     }
    // ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

//sign in post module, compares with database email and password for a validation check.
app.post('/signin', (req, res) => {
    // bcrypt.compare("apples", "$2a$10$MnCz.itBgJZvyTBTJBQxOu1vhb.BiTIkWaQyZufVhvxq3MpG5UEAq", function(err, res) {
    //     // res == true
    //     console.log('first guess', res)
    // });
    // bcrypt.compare("veggies", "$2a$10$MnCz.itBgJZvyTBTJBQxOu1vhb.BiTIkWaQyZufVhvxq3MpG5UEAq", function(err, res) {
    //     console.log('second guess', res)
    // });
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // }); 
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})


//the syntax below ':id' allows for the get request to use params 
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //there are better ways to do this, but this will allow the loop to exit when found
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

//this will keep count of the user image submissions
app.put('/image', (req, res) => {
    const { id } = req.body;
    //this should actually be a function by now...
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

//npm listener for changes/debugging.
app.listen(3000, () => {
    console.log('App is running on port 3000');
})


