const express = require('express');
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        port: 5432,
        password: 'SQLPassX&7',
        database: 'smart_brain'
    }
});

db.select('*').from('users').then(data => {});

const app = express();

//need the json parser module that is contained here for express to interpret JSON.
// using express.json instead of the body parser module.
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors())
//this is the database that we will be comparing with.

app.get('/', (req, res) => {
    res.send('success')
})

//sign in post module, compares with database email and password for a validation check.
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
        res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))

})


app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password)
        db.transaction(trx => { //trx is a transaction, this ensures that the information is fed to 
                                // both the login database, as well as the users.
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                .returning('*')
                .insert({
                    email : loginEmail[0].email, // this syntax is used with knex to ensure that the login email is not returned as an object to users.
                    name: name,
                    joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                })
            })
            .then(trx.commit) //in order for the transaction to be completed,it needs to be committed to the database
            .catch(trx.rollback) // should it fail at one of the multiple actions in the transaction, it needs to rollback all changes.
        })
    .catch(err => res.status(400).json('unable to register'))
})


//the syntax below ':id' allows for the get request to use params 
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length){
            res.json(user[0]);
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err=> res.status(400).json('error getting user'))
})

//this will keep count of the user image submissions
app.put('/image', (req, res) => {
    const { id } = req.body;
    //this should actually be a function by now...
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
})

//npm listener for changes/debugging.
app.listen(3000, () => {
    console.log('App is running on port 3000');
})


