
const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password); //stored hash of pass in hash
  //doing .transaction because newly registered users also have to be stored in the login table(db) 
  //alonghwith users table(db).
  db.transaction(trx => {  //here db is the trx now.
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')  //trx.insert .into('login')
      .returning('email')  //which returns email
      //now after inserting in login table, we insert in user table
      .then(loginEmail => {
        db('users').returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          //and responds with the user.
          .then(user => {
            res.json(user[0]);
          })
      })
      //in order to get it done successful
      .then(trx.commit)
      .catch(trx.rollback)  //if anything fails it'll rollback any changes
  })
    .catch(err => res.status(400).json('Unable to register'))
  //pushing, aur baaki name, email, password in sabki value postman se daalni padegi.
  // //latest update 
  // database.user.push({
  //   id: '126',
  //   name: name,
  //   email: email,
  //   // password: name, we don;t need to show it on the response on network tab
  //   entries: 0,
  //   joined: new Date()
  // })
  // res.json(database.user[database.user.length-1]);  uppar iski jagah
}

module.exports = {
  handleRegister: handleRegister
}