const express = require('express');
const app = express();


//need the json parser module that is contained here for express to interpret JSON.
// using express.json instead of the body parser module.
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//this is the database that we will be comparing with.
const database = {
    users: [
        {
            id: '123',
            name: 'john',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bannanas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

//sign in post module, compares with database email and password for a validation check.
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json('success');
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body; 
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


