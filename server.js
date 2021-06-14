const express = require('express');
const bodyParser = require('body-parser');
//this one is for the security issue. to protect the password
//it turns pass string into a hash code.
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    // host: "postgresql-clear-15495",
    connectionString: process.env.DATABASE_URL,
    // user: 'postgres',
    // password: 'admin',
    // database: 'facerec_db'
    ssl: true
  }
});

// db.select('*').from('users').then(data => {
//   // console.log(data);
// });

const app = express();

// in able to use app.req we need to use bodyParser, bc express don't know we are passing json
app.use(bodyParser.json());
//cors
app.use(cors());

// const database = {
//   user: [
//     {
//       id: '123',
//       name: 'Levi',
//       email: 'Levi@gmail.com',
//       password: 'erwin',
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: '124',
//       name: 'Eren',
//       email: 'Eren@gmail.com',
//       password: 'mikasa',
//       entries: 0,
//       joined: new Date()
//     }
//   ],
//   login: [
//     {
//       id: '987',
//       hash: '',
//       email: 'Levi@gmail.com'
//     }
//   ]
// }

app.get('/', (req, res) => { res.send(process.env.DATABASE_URL) })

//checking if an existing user signed in with correct credentials or not.
app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)} )

//now registering new users:
//How to CONNECT FRONTEND TO DATABASE, USING KNEX, search for insert commands in knex document
//ab yaha site pe jo dalega register karega uski info db mein store ho jaygi.
//just like insert() there is returning() in knex, it returns every user entered on reg. page
//.into .insert .returning all are on knex documentation.

/*  
db.transaction(trx => {}) =
A TRANSACTION is a single logical unit of work which accesses and possibly modifies the contents 
of a database. Transactions access data using read and write operations. In order to maintain 
consistency in a database, before and after the transaction, certain properties are followed   

.then(trx.commit) =
Notice that if a promise is not returned within the handler, it is up to you to ensure trx.commit,
or trx.rollback are called, otherwise the transaction connection will hang.

.catch(trx.rollback) = 
Calling trx.rollback will return a rejected Promise. If you don't pass any argument to trx.rollback, 
a generic Error object will be created and passed in to ensure the Promise always rejects with something.
*/

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

//postman mein localhost:3000/profile/124
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

//now updating the entries
app.put('/image', (req, res) => { image.handleImage(req, res, db)} )

//API call through the backend
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000 , ()=> {
  console.log(`app is running on port ${process.env.PORT} 3000`);
});

/* 
this all has to be created!!
/--> res = this is working
/signin --> POST = success/fail
/register --> PUT = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/