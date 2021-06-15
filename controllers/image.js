//Yaha api ko store karenge
const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.MY_API_KEY
  //my api key 
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}


const handleImage = (req, res, db) => {
  //req.body se pass karenge, aur postman mein body section mein jaake daalege
  //{ "id": "123" }
  const { id } = req.body;
  //  COMMENTED BELOW BECAUSE NOW USING DATABASE.
  // let found = false;
  // database.user.forEach(user => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries++;
  //     return res.json(user.entries);
  //   }
  // })
  // if (!found) {
  //   res.status(404).json('Not found');
  // }

  //READING FROM USER TABLE.
  db('users').where('id', '=', id)
    .increment('entries', 1)  //KNEX DOCUMENTATION SE PADHKE LAAO
    .returning('entries')
    .then(entries => {
      // console.log(entries);
      res.json(entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
  handleImage, 
  handleApiCall: handleApiCall
}