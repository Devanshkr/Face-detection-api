const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '4af055be19814b16a491fb6e0b5c280d'
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
  const { id } = req.body;

  //READING FROM USER TABLE.
  db('users').where('id', '=', id)
    .increment('entries', 1) 
    .returning('entries')
    .then(entries => {
      res.json(entries);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
  handleImage, 
  handleApiCall: handleApiCall
}
