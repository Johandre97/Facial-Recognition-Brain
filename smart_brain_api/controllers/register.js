const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email ||!name || !password ) {
        return res.status(400).json('incorrect form submission')
    }
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
}

module.exports = {
    handleRegister: handleRegister
};